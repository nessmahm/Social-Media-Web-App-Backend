import { CreateReusableDto } from 'src/reusable/dto/create-reusable.dto';
import { User } from 'src/user/entities/user.entity';
import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto extends CreateReusableDto {
  @IsNotEmpty({
    message: 'the comment should not be empty',
  })
  content: string;
}
