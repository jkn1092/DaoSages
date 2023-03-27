import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsResolver } from './projects.resolver';
import { ProjectsService } from './projects.service';
import {getModelToken} from "@nestjs/mongoose";
import {Project} from "./entities/project.entity";
import {ProjectNotFoundException} from "../exceptions/ProjectNotFoundException";
import {ProjectAlreadyExistsException} from "../exceptions/ProjectAlreadyExistsException";

function projectsModelMock(dto: any) {
  this.data = dto;
  this.save = () => {
    return this.data;
  };
}

const projectMock: Project = {
  _id: undefined,
  daoId: '1',
  name: 'testtest',
  description: 'test test',
};

const projectsServiceMock = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
};

describe('Given ProjectsResolver', () => {
  let resolver: ProjectsResolver;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          ProjectsResolver,
        { provide: ProjectsService, useValue: projectsServiceMock },
        {
          provide: getModelToken('User'),
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
            daoId: 't1est',
            name: 'TestName2',
            description: 'Test description 1',
          },
          {
            daoId: '2',
            name: 'TestName1',
            description: 'Test description 2',
          },
        ];
      });
      result = await resolver.findAll();
    });

    test('Then it should find all projects', async () => {
      expect(result).toEqual([
        {
          daoId: 't1est',
          name: 'TestName2',
          description: 'Test description 1',
        },
        {
          daoId: '2',
          name: 'TestName1',
          description: 'Test description 2',
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
