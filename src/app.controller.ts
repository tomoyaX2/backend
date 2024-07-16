import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

let mockData = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    owner_email: 'user1@example.com',
    owner_code: '8372',
    ip: '192.168.1.1',
    status: 'live',
    disabled_reason: null,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    owner_email: 'user2@example.com',
    owner_code: '4821',
    ip: '172.16.254.1',
    status: 'disabled',
    disabled_reason: 'payment overdue',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    owner_email: 'user3@example.com',
    owner_code: '1902',
    ip: '10.0.0.1',
    status: 'live',
    disabled_reason: null,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    owner_email: 'user4@example.com',
    owner_code: '7491',
    ip: '203.0.113.1',
    status: 'disabled',
    disabled_reason: 'server error',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    owner_email: 'user5@example.com',
    owner_code: '3758',
    ip: '198.51.100.1',
    status: 'live',
    disabled_reason: null,
  },
];
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('get-mock-data')
  getMockData() {
    return mockData;
  }

  @Post('edit-mock-data')
  async editMockData(@Body() body: any) {
    mockData = mockData.map((el) => (body.id === el.id ? body : el));
  }
}
