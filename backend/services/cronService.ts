import cron from 'node-cron';
import Task from '../models/Task';
import User from '../models/User';
import Notification from '../models/Notification';
import { sendEmail } from './emailService';

export const startCronJobs = () => {
  // Run every hour to check for upcoming deadlines (within 24 hours)
  cron.schedule('0 * * * *', async () => {
    console.log('Running deadline check...');
    const now = new Date();
    const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    try {
      const tasks = await Task.find({
        deadline: { $gte: now, $lte: next24h },
        status: { $ne: 'completed' }
      }).populate('userId');

      for (const task of tasks) {
        const user: any = task.userId;
        
        // Check if notification already exists for this task/deadline to avoid spam
        const exists = await Notification.findOne({
          userId: user._id,
          taskId: task._id,
          type: 'deadline',
          createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } // Checked recently
        });

        if (!exists) {
            // Create App Notification
            await Notification.create({
                userId: user._id,
                taskId: task._id,
                type: 'deadline',
                message: `Deadline approaching for task: ${task.title}`
            });

            // Send Email if enabled
            if (user.notificationSettings?.emailAlerts) {
                await sendEmail(
                    user.email,
                    `Task Deadline Warning: ${task.title}`,
                    `Your task "${task.title}" is due soon (Deadline: ${task.deadline}).`
                );
            }
        }
      }
    } catch (error) {
      console.error('Cron job failed:', error);
    }
  });
};