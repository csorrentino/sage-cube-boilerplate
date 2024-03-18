<?php

namespace Csorrentino\SageCubeBoilerplate\Providers;

use Illuminate\Support\ServiceProvider;

class SageCubeBoilerplateServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->publishes([
            __DIR__.'/../../publishes/tailwind.config.js' => $this->app->basePath('tailwind.config.js'),
        ], 'cube-tailwind-config');

        $this->publishes([
            __DIR__.'/../../publishes/resources' => $this->app->resourcePath(),
        ], 'cube-resources');
    }
}
