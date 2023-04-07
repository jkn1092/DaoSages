import {HttpService} from "@nestjs/axios";
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import {ProjectNotFoundException} from "../exceptions/ProjectNotFoundException";
import {ProjectAlreadyExistsException} from "../exceptions/ProjectAlreadyExistsException";
import {CoinGecko} from "./entities/coinGecko.entity";

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService, private httpService: HttpService) {}

  @Mutation(() => Project)
  async createProject(@Args('createProjectInput') createProjectInput: CreateProjectInput) {
    const user: Project = await this.projectsService.findOne(
        createProjectInput.daoId,
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
  async findOne(@Args('daoId', { type: () => String }) daoId: string) {
    const projectFound : Project = await this.projectsService.findOne(daoId);
    if (projectFound === null) {
      throw new ProjectNotFoundException('project not found');
    }
    return projectFound;
  }

  @Query(() => CoinGecko, { name: 'coinGecko' })
  async findCoinGeckoData(@Args('daoId', { type: () => String }) daoId: string) {
    const projectFound : Project = await this.projectsService.findOne(daoId);
    const url = 'https://api.coingecko.com/api/v3/coins/'+ projectFound.token;

    try {
      const response = await this.httpService.get(url).toPromise();
      return response.data;
    } catch (error) {
      throw new ProjectNotFoundException('Unable to fetch data from external API');
    }
  }
}
