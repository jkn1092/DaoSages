import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';
import {join} from "path";

const url = process.env.MONGO_URL || '127.0.0.1';
//const user = process.env.MONGO_USER || 'admin';
//const password = process.env.MONGO_PASSWORD || 'admin';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${url}:27017`, {
      dbName: 'dao_sages',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      installSubscriptionHandlers: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
      ProjectsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
