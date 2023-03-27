import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import {ProjectNotFoundException} from "../exceptions/ProjectNotFoundException";
import {ProjectAlreadyExistsException} from "../exceptions/ProjectAlreadyExistsException";

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Mutation(() => Project)
  async createProject(@Args('createProjectInput') createProjectInput: CreateProjectInput) {
    const user: Project = await this.projectsService.findOne(
        createProjectInput._id,
    );
    if (user) {
      throw new ProjectAlreadyExistsException(
          'project id already exists',
      );
    }

    return this.projectsService.create(createProjectInput);
  }

  @Query(() => [Project], { name: 'projects' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Query(() => Project, { name: 'project' })
  async findOne(@Args('_id', { type: () => String }) id: string) {
    const projectFound : Project = await this.projectsService.findOne(id);
    if (projectFound === null) {
      throw new ProjectNotFoundException('project not found');
    }
    return projectFound;
  }
}
