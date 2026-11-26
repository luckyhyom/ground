import { Module, StandardSchemaValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    // @Body({ schema }) / @Param(..., { schema }) 로 지정한 스키마를 검증한다.
    { provide: APP_PIPE, useClass: StandardSchemaValidationPipe },
  ],
})
export class AppModule {}
