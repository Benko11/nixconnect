<?php

namespace App\Providers;

use App\Models\ColourScheme;
use App\Models\Font;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        app()->bind('uwu', fn () => 'owo');
        // app()->bind(Newsletter::class, fn () => new Newsletter(new ApiClient(), 'arbitrary value'))
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Relation::morphMap([
            'text' => 'App\Models\PostTypes\Text',
            'gallery' => 'App\Models\PostTypes\Gallery',
            'code' => 'App\Models\PostTypes\Code',
            'article' => 'App\Models\PostTypes\Article',

            'post' => 'App\Models\Post',
            'fork' => 'App\Models\Fork'
        ]);

        Inertia::share('appName', config('app.name'));
        Inertia::share('deleteConfirmation', env('USER_DELETE_CONFIRMATION'));
    }
}
