import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiOkResponse({
    description: 'The API is up',
    schema: {
      example: { status: 'ok', timestamp: '2026-10-16T12:00:00.000Z' },
    },
  })
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
