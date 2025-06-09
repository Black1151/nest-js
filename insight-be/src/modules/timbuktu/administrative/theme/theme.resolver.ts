import { Resolver } from '@nestjs/graphql';
import { createBaseResolver } from 'src/common/base.resolver';
import { ThemeEntity } from './theme.entity';
import { CreateThemeInput, UpdateThemeInput } from './theme.inputs';
import { ThemeService } from './theme.service';

const BaseThemeResolver = createBaseResolver<
  ThemeEntity,
  CreateThemeInput,
  UpdateThemeInput
>(ThemeEntity, CreateThemeInput, UpdateThemeInput, {
  queryName: 'Theme',
  stableKeyPrefix: 'theme',
  enabledOperations: [
    'findAll',
    'findOne',
    'findOneBy',
    'create',
    'update',
    'remove',
    'search',
  ],
});

@Resolver(() => ThemeEntity)
export class ThemeResolver extends BaseThemeResolver {
  constructor(private readonly themeService: ThemeService) {
    super(themeService);
  }
}
