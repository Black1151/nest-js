import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { createBaseResolver } from 'src/common/base.resolver';
import { ThemeEntity } from './theme.entity';
import {
  CreateThemeInput,
  UpdateThemeInput,
  FindAllThemeInput,
  UpgradeThemeVersionInput,
} from './theme.inputs';
import { IdInput } from 'src/common/base.inputs';
import { RbacPermissionKey } from 'src/modules/rbac/decorators/resolver-permission-key.decorator';
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

  @Query(() => ThemeEntity, { name: 'getTheme', description: 'Returns one Theme' })
  @RbacPermissionKey('theme.getTheme')
  async findOne(
    @Args('data', { type: () => IdInput }) data: IdInput,
  ): Promise<ThemeEntity> {
    return this.themeService.findOne(data.id, ['componentVariants']);
  }

  @Query(() => [ThemeEntity], {
    name: 'getAllTheme',
    description: 'Returns all Theme (optionally filtered)',
  })
  @RbacPermissionKey('theme.getAllTheme')
  async findAll(
    @Args('data', { type: () => FindAllThemeInput }) data: FindAllThemeInput,
  ): Promise<ThemeEntity[]> {
    const { styleCollectionId, filters = [], ...rest } = data;
    const finalFilters = [
      ...filters,
      ...(styleCollectionId
        ? [{ column: 'styleCollectionId', value: styleCollectionId }]
        : []),
    ];
    return this.themeService.findAll({
      ...rest,
      filters: finalFilters,
      relations: ['componentVariants'],
    });
  }

  @Mutation(() => ThemeEntity, {
    name: 'upgradeThemeVersion',
    description: 'Upgrade a theme to a specific version',
  })
  async upgradeThemeVersion(
    @Args('data', { type: () => UpgradeThemeVersionInput }) data: UpgradeThemeVersionInput,
  ): Promise<ThemeEntity> {
    return this.themeService.upgradeVersion(data.id, data.version);
  }
}
