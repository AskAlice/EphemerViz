import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function createMockConfigService(get): Provider {
  return {
    provide: ConfigService,
    useValue: {
      get: jest.fn().mockImplementation((propertyPath: string) => {
        if (propertyPath == 'env') {
          return 'development';
        }

        return get(propertyPath);
      }),
    },
  };
}
