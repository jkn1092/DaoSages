import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';
import {join} from "path";

const url = process.env.MONGO_URL || '127.0.0.1:27017';
const user = process.env.MONGO_USER || '';
const password = process.env.MONGO_PASSWORD || '';
//mongodb+srv://${user}:${password}@${url}
@Module({
  imports: [
    MongooseModule.forRoot(`mongodb+srv://daosages:5drj2Im6WxRrs2EP@cluster0.dvr04uq.mongodb.net`, {
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
