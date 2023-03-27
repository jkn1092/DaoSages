import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import { CreateProjectInput } from './dto/create-project.input';
import {Project, ProjectDocument} from "./entities/project.entity";

@Injectable()
export class ProjectsService {
  constructor(
      @InjectModel(Project.name)
      private readonly projectModel: Model<ProjectDocument>,
  ) {}

  create(createProjectInput: CreateProjectInput): Promise<Project> {
    const project: ProjectDocument = new this.projectModel();

    if( project !== null ){
      project._id = createProjectInput._id;
      project.name = createProjectInput.name;
      project.description = createProjectInput.description;

      return project.save();
    }

    return null;
  }

  async findAll(): Promise<Project[]> {
    return this.projectModel.find({});
  }

  async findOne(_id: string): Promise<Project> {
    return this.projectModel.findById(_id);
  }
}
