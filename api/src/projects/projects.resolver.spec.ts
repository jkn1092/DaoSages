import { Test, TestingModule } from '@nestjs/testing';
import {getModelToken} from "@nestjs/mongoose";
import { ProjectsResolver } from './projects.resolver';
import { ProjectsService } from './projects.service';
import {Project} from "./entities/project.entity";
import {ProjectNotFoundException} from "../exceptions/ProjectNotFoundException";
import {ProjectAlreadyExistsException} from "../exceptions/ProjectAlreadyExistsException";
import {HttpService} from "@nestjs/axios";

function projectsModelMock(dto: any) {
  this.data = dto;
  this.save = () => {
    return this.data;
  };
}

const projectMock: Project = {
  _id: undefined,
  daoId: '1',
  name: 'NAME_TEST',
  token: 'TOKEN_TEST',
  codeSource: 'CS_TEST',
  socialMedia: 'SOCIAL_TEST',
  email: 'MAIL_TEST',
  description: 'DESC_TEST',
};

const projectsServiceMock = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
};

const httpServiceMock = {

}

describe('Given ProjectsResolver', () => {
  let resolver: ProjectsResolver;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          ProjectsResolver,
        { provide: ProjectsService, useValue: projectsServiceMock },
        { provide: HttpService, useValue: httpServiceMock },
        {
          provide: getModelToken('Project'),
          useValue: projectsModelMock,
        },
      ],
    }).compile();

    resolver = module.get<ProjectsResolver>(ProjectsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('When creating a project', () => {
    let result: Project;
    beforeAll(async () => {
      projectsServiceMock.create = jest.fn(() => projectMock);
      result = await resolver.createProject(projectMock);
    });

    test('Then it should create a project', async () => {
      expect(result).toEqual(projectMock);
    });
  });

  describe('When creating a project with id that exists', () => {
    let result: () => Promise<Project>;
    beforeAll(() => {
      projectsServiceMock.findOne = jest.fn(() => projectMock);
      result = () => resolver.createProject(projectMock);
    });

    test('Then it should throw an ProjectAlreadyExistsException', async () => {
      try {
        await result();
      } catch (error) {
        expect(error).toBeInstanceOf(ProjectAlreadyExistsException);
      }
    });
  });

  describe('When finding all projects', () => {
    let result: Project[];
    beforeAll(async () => {
      projectsServiceMock.findAll = jest.fn(() => {
        return [
          {
            daoId: '1',
            name: 'TestName1',
            description: 'Test description 1',
            token: 'TOKEN_TEST1',
            codeSource: 'CS_TEST1',
            socialMedia: 'SOCIAL_TEST1',
            email: 'MAIL_TEST1',
          },
          {
            daoId: '2',
            name: 'TestName2',
            description: 'Test description 2',
            token: 'TOKEN_TEST2',
            codeSource: 'CS_TEST2',
            socialMedia: 'SOCIAL_TEST2',
            email: 'MAIL_TEST2',
          },
        ];
      });
      result = await resolver.findAll();
    });

    test('Then it should find all projects', async () => {
      expect(result).toEqual([
        {
          daoId: '1',
          name: 'TestName1',
          description: 'Test description 1',
          token: 'TOKEN_TEST1',
          codeSource: 'CS_TEST1',
          socialMedia: 'SOCIAL_TEST1',
          email: 'MAIL_TEST1',
        },
        {
          daoId: '2',
          name: 'TestName2',
          description: 'Test description 2',
          token: 'TOKEN_TEST2',
          codeSource: 'CS_TEST2',
          socialMedia: 'SOCIAL_TEST2',
          email: 'MAIL_TEST2',
        },
      ]);
    });
  });

  describe('When finding a project', () => {
    const id = '1'
    let result: Project;

    beforeAll(async () => {
      projectsServiceMock.findOne = jest.fn(() => projectMock);

      result = await resolver.findOne(id);
    });

    test('Then it should find one', async () => {
      expect(result).toEqual(projectMock);
    });
  });

  describe('When finding a non existent project', () => {
    const id = '1';

    beforeAll(async () => {
      projectsServiceMock.findOne = jest.fn(() => null);
    });

    test('Then it should throw ProjectNotFoundException', async () => {
      try {
        await resolver.findOne(id);
      } catch (error) {
        expect(error).toBeInstanceOf(ProjectNotFoundException);
      }
    });
  });
});
