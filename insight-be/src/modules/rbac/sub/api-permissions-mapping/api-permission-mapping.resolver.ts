// rbac/api-permission-mapping.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ApiPermissionMapping } from './api-permission-mapping.entity';
import { ApiPermissionMappingService } from './api-permission-mapping.service';
import { RbacPermissionKey } from 'src/modules/rbac/decorators/resolver-permission-key.decorator';
import { ImmutableLogging } from 'src/modules/audit/decorators/immutable-logging.decorator';
@Resolver(() => ApiPermissionMapping)
export class ApiPermissionMappingResolver {
  constructor(private readonly mappingService: ApiPermissionMappingService) {}

  @Query(() => [ApiPermissionMapping])
  async apiPermissionMappings(): Promise<ApiPermissionMapping[]> {
    return this.mappingService.findAll();
  }

  @Mutation(() => ApiPermissionMapping)
  @RbacPermissionKey('api-permission-mapping.set-route-permissions')
  @ImmutableLogging()
  async setRoutePermissions(
    @Args('routeKey') routeKey: string,
    @Args('permissionIds', { type: () => [Number] }) permissionIds: number[],
  ): Promise<ApiPermissionMapping> {
    return this.mappingService.setPermissions(routeKey, permissionIds);
  }

  @Mutation(() => Boolean)
  @RbacPermissionKey('api-permission-mapping.remove-route-permissions')
  @ImmutableLogging()
  async removeRoutePermissions(
    @Args('routeKey') routeKey: string,
  ): Promise<boolean> {
    return this.mappingService.removeMapping(routeKey);
  }
}
