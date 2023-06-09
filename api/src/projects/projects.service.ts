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
      project.daoId = createProjectInput.daoId;
      project.name = createProjectInput.name;
      project.token = createProjectInput.token;
      project.codeSource = createProjectInput.codeSource;
      project.socialMedia = createProjectInput.socialMedia;
      project.email = createProjectInput.email;
      project.description = createProjectInput.description;

      return project.save();
    }

    return null;
  }

  async findAll(): Promise<Project[]> {
    return this.projectModel.find({});
  }

  async findOne(daoId: string): Promise<Project> {
    return this.projectModel.findOne({ daoId: daoId });
  }
}
