import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseFilePipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express/';
import { JwtAuthGuard } from '../user/Guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { Request } from 'express';
import { imageFileFilter } from '../Filters/imageFilter';
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body('content') content: string,
    @UploadedFile()
    file: /*new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'jpeg' }),
      ],
    }),*/
    Express.Multer.File,

    @User() user,
  ) {
    const image = file?.originalname || '';
    if (!content) {
      content = '';
    }
    const post: CreatePostDto = {
      content: content,
      imageUrl: image,
      owner: user,
    };
    return await this.postService.addPost(post);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@User() user, @Param('id') id) {
    return this.postService.remove(id, user);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('content') content: string,
    @User() user,
  ) {
    const image = file?.originalname || '';

    console.log('logged user ' + user.username);
    const post: UpdatePostDto = {
      id: id,
      content: content ?? '',
      imageUrl: image,
    };
    return this.postService.updatePost(user, post);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() request: Request) {
    return request.user;
  }

  @Get('numberOFlikes/:id')
  @UseGuards(JwtAuthGuard)
  getNumberOfLikesById(@Param('id') id: string) {
    return this.postService.getNumberOfLikesOfPost(id);
  }
  @Get('likes/:id')
  @UseGuards(JwtAuthGuard)
  getLikesById(@Param('id') id: string) {
    return this.postService.getLikesOfPost(id);
  }

  @Post('like/:id')
  @UseGuards(JwtAuthGuard)
  async likePost(@Param('id') id: string, @User() user) {
    console.log(user);
    return await this.postService.likePost(id, user);
  }

  @Delete('dislike/:post')
  @UseGuards(JwtAuthGuard)
  async dislikePost(@Param('post') postId: string, @User() user) {
    return await this.postService.dislikePost(user.id, postId);
  }

  @Get('get-comments/:id')
  findByPost(@Param('id') id: string) {
    return this.postService.getCommentsByPost(id);
  }

  @Get('get-by-friends')
  @UseGuards(JwtAuthGuard)
  async getPostsOfFriends(@User() user) {
    return await this.postService.getPostsOfMyFriends(user.id);
  }

  @Get('get-by-user/:userId')
  @UseGuards(JwtAuthGuard)
  async getPostsofUser(@User() user, @Param('userId') userId: string) {
    return this.postService.getPostsOfUser(userId, user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }
}
