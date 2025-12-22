import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import Project from '../models/Project';

interface AuthRequest extends ExpressRequest {
    user?: any;
}

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req: any, res: any) => {
    const authReq = req;
    try {
        const projects = await Project.find({ ownerId: authReq.user._id });
        res.status(200).json(projects);
    } catch (e) {
        res.status(500).json({ message: "Failed to fetch projects" });
    }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req: any, res: any) => {
    const authReq = req;
    const { title, description, color, privacy } = req.body;

    if (!title) return res.status(400).json({ message: "Title required" });

    try {
        const project = await Project.create({
            title,
            description,
            color,
            privacy,
            ownerId: authReq.user._id,
            members: [authReq.user._id]
        });
        res.status(201).json(project);
    } catch (e) {
        res.status(500).json({ message: "Failed to create project" });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req: any, res: any) => {
    const authReq = req;
    try {
        const project = await Project.findOne({ _id: req.params.id, ownerId: authReq.user._id });

        if (!project) return res.status(404).json({ message: "Project not found" });

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedProject);
    } catch (e) {
        res.status(500).json({ message: "Failed to update project" });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req: any, res: any) => {
    const authReq = req;
    try {
        const project = await Project.findOne({ _id: req.params.id, ownerId: authReq.user._id });

        if (!project) return res.status(404).json({ message: "Project not found" });

        await project.deleteOne();
        res.status(200).json({ message: "Project deleted" });
    } catch (e) {
        res.status(500).json({ message: "Failed to delete project" });
    }
};
