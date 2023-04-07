import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';
import {join} from "path";

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.MONGO_URI}`, {
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
