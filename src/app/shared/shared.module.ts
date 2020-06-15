import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [],
  declarations: []
})
export class RootSharedModule {}

@NgModule({
  imports: [CommonModule],
  declarations: [],
  exports: [],
  entryComponents: []
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<RootSharedModule> {
    return {
      ngModule: RootSharedModule,
      providers: [
        
      ]
    };
  }
}