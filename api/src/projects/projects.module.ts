import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsService } from './projects.service';
import { ProjectsResolver } from './projects.resolver';
import {Project, ProjectSchema} from "./entities/project.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
    ]),
    HttpModule
  ],
  providers: [ProjectsResolver, ProjectsService]
})
export class ProjectsModule {}
