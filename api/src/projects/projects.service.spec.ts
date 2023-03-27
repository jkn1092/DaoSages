import { Test, TestingModule } from '@nestjs/testing';
import {getModelToken} from "@nestjs/mongoose";
import { factory } from 'fakingoose';
import { ProjectsService } from './projects.service';
import {Project, ProjectDocument, ProjectSchema} from "./entities/project.entity";
import {ProjectsModule} from "./projects.module";
import {rootMongooseTestModule} from "./test-db";
import mongoose, {Model} from "mongoose";
import {CreateProjectInput} from "./dto/create-project.input";

describe('Given ProjectsService', () => {
  let service: ProjectsService;
  let projectModel: Model<ProjectDocument>;
  const projectFactory = factory<ProjectDocument>(
      ProjectSchema,
      {},
  ).setGlobalObjectIdOptions({ tostring: false });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), ProjectsModule],
      providers: [],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    projectModel = module.get<Model<ProjectDocument>>(getModelToken(Project.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When creating a project', () => {
    let result: Project;

    const createProjectInputMock: CreateProjectInput = {
      daoId: '1',
      name: 'NAME_TEST',
      token: 'TOKEN_TEST',
      codeSource: 'CS_TEST',
      socialMedia: 'SOCIAL_TEST',
      email: 'MAIL_TEST',
      description: 'DESC_TEST',
    };

    beforeEach(async () => {
      result = await service.create(createProjectInputMock);
    });

    test('It should return a new project', () => {
      expect(result.daoId).toEqual(createProjectInputMock.daoId);
      expect(result.name).toEqual(createProjectInputMock.name);
      expect(result.description).toEqual(createProjectInputMock.description);
    });

    afterEach(async () => {
      await projectModel.deleteMany();
    });
  });

  describe('When finding all', () => {
    let result: Project[];

    beforeEach(async () => {
      let mock;
      for (let i = 0; i < 4; i++) {
        mock = projectFactory.generate({
          _id: new mongoose.Types.ObjectId(),
          daoId: 'i'+i,
          name: 'NAME_TEST',
          token: 'TOKEN_TEST',
          codeSource: 'CS_TEST',
          socialMedia: 'SOCIAL_TEST',
          email: 'MAIL_TEST',
          description: 'DESC_TEST',
        });
        await projectModel.create(mock);
      }

      result = await service.findAll();
    });

    test('It should return an array of projects', () => {
      expect(result.length).toEqual(4);
    });

    afterEach(async () => {
      await projectModel.deleteMany();
    });
  });

  describe('When finding one', () => {
    let result: Project;
    let projectMock: Project;

    beforeEach(async () => {
      projectMock = projectFactory.generate({
        _id: new mongoose.Types.ObjectId(),
        daoId: '1',
        name: 'NAME_TEST',
        token: 'TOKEN_TEST',
        codeSource: 'CS_TEST',
        socialMedia: 'SOCIAL_TEST',
        email: 'MAIL_TEST',
        description: 'DESC_TEST',
      });
      await projectModel.create(projectMock);
      result = await service.findOne('1');
    });

    test('It should return a project', () => {
      expect(result._id).toEqual(projectMock._id);
      expect(result.daoId).toEqual(projectMock.daoId);
      expect(result.name).toEqual(projectMock.name);
      expect(result.description).toEqual(projectMock.description);
    });

    afterEach(async () => {
      await projectModel.deleteMany();
    });
  });
});
