import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule, Location, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgxDnDModule } from '@swimlane/ngx-dnd';

import {
  DocspaCoreModule,
  DocsifyPluginsModule,
  RuntimeContentModule,
  MarkdownModule,
  MarkdownElementsModule
} from '@swimlane/docspa-core';

import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { preset } from '@swimlane/docspa-remark-preset';

import { AppComponent } from './app.component';

import { config } from '../docspa.config';
import { environment } from '../environments/environment';
import { BuilderModule } from './builder/builder.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BuilderModule,
    LoadingBarModule.forRoot(),
    LoadingBarHttpClientModule,
    LoggerModule.forRoot({ level: NgxLoggerLevel.WARN }),
    DocspaCoreModule.forRoot(config, environment),
    MarkdownModule.forRoot(preset),
    NgxDnDModule.forRoot(),
    MarkdownElementsModule.forRoot(),
    RuntimeContentModule.forRoot({
      imports: [
        CommonModule,
        NgxDnDModule,
        BuilderModule
      ]
    }),
    DocsifyPluginsModule.forRoot({
      plugins: []
    })
  ],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
