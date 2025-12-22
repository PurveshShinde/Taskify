import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    color: {
        type: String,
        default: '#6366f1',
    },
    privacy: {
        type: String,
        enum: ['public', 'private', 'team'],
        default: 'private',
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    status: {
        type: String,
        enum: ['active', 'archived', 'completed'],
        default: 'active',
    },
}, {
    timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
