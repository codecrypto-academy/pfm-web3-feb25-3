import { Body, Controller, HttpCode, Logger, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserLoginDTO } from '../../service/dto/user-login.dto';
import { AuthService } from '../../service/auth.service';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api')
@UseInterceptors(LoggingInterceptor)
@ApiTags('user-jwt-controller')
export class UserJWTController {
  logger = new Logger('UserJWTController');

  constructor(private readonly authService: AuthService) {}

  @Post('/authenticate')
  @HttpCode(200)
  @ApiOperation({ summary: 'Authorization api retrieving token' })
  @ApiResponse({
    status: 200,
    description: 'Authorized',
  })
  async authorize(@Req() req: Request, @Body() user: UserLoginDTO, @Res() res: Response): Promise<any> {
    const jwt = await this.authService.login(user);
    res.setHeader('Authorization', `Bearer ${jwt.id_token}`);
    return res.json(jwt);
  }
}
