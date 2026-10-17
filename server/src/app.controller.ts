import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

/** Sends anyone opening the root URL (for example over the LAN) to the Swagger UI. */
@ApiExcludeController()
@Controller()
export class AppController {
  @Get()
  @Redirect('/docs', 302)
  redirectToDocs() {}
}
