<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\Post\ArticleController;
use App\Http\Controllers\Post\CodeController;
use App\Http\Controllers\Post\GalleryController;
use App\Http\Controllers\Post\TextController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\Profile\ProfileController;
use App\Http\Controllers\Profile\UserFactController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\Settings\AccountController;
use App\Http\Controllers\Settings\Appearance\AppearanceController;
use App\Http\Controllers\Settings\Appearance\BackgroundController;
use App\Http\Controllers\Settings\Appearance\ColourSchemeController;
use App\Http\Controllers\Settings\Appearance\FlashMessageController;
use App\Http\Controllers\Settings\Appearance\FontController;
use App\Http\Controllers\Settings\Appearance\MaxSizeController;
use App\Http\Controllers\Settings\Media\AvatarController;
use App\Http\Controllers\Settings\Media\BannerController;
use App\Http\Controllers\Settings\Media\MediaController;
use App\Http\Controllers\Settings\Privacy\PrivacyController;
use App\Http\Controllers\StashController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->middleware('guest');

Route::get('/home', HomeController::class)->middleware(['auth', 'verified', 'tour'])->name('home');

Route::group(['prefix' => 'legal', 'as' => 'legal.'], function () {
    Route::get('/', function () {
        return Inertia::render('Legal');
    });
    
    Route::get('/privacy-policy', function() {
        $file = file_get_contents('../privacy-policy.md');
        $title = "Privacy Policy";
    
        return Inertia::render('Document', compact('file', 'title'));
    })->name('privacy-policy');

    Route::get('/licence', function() {
        $file = file_get_contents('../LICENSE');
        $title = "Licence";
    
        return Inertia::render('Document', compact('file', 'title'));
    })->name('licence');

    Route::get('/code-of-conduct', function () {
        $file = file_get_contents('../CODE_OF_CONDUCT.md');
        $title = "Code of Conduct";

        return Inertia::render('Document', compact('file', 'title'));
    })->name('code-of-conduct');
});

Route::get('/stash', [StashController::class, 'index'])->name('stash')->middleware(['auth', 'verified', 'tour']);

Route::group(['prefix' => 'profile', 'middleware' => ['auth', 'verified', 'tour'], 'as' => 'profile.'], function () {
    Route::get('/', [ProfileController::class, 'indexMe'])->name('indexMe');
    Route::get('/~{user}', [ProfileController::class, 'index'])->name('index');
    Route::post('/add-fact', [UserFactController::class, 'store'])->name('add-fact');

    Route::post('/follow/{user}', [ProfileController::class, 'follow'])->name('follow');
    Route::post('/unfollow/{user}', [ProfileController::class, 'unfollow'])->name('unfollow');
});

Route::group(['prefix' => 'search', 'middleware' => ['auth', 'verified', 'tour'], 'as' => 'search.'], function () {
    Route::get('/', [SearchController::class, 'index'])->name('index');
    Route::post('/', [SearchController::class, 'search'])->name('query');
});


Route::group(['prefix' => 'posts', 'middleware' => ['auth', 'verified', 'tour'], 'as' => 'posts.'], function() {
    Route::get('{post}', [PostController::class, 'show']);

    Route::post('text', [TextController::class, 'store'])->name('text');
    Route::patch('text/{post}', [TextController::class, 'update'])->name('text-update');

    Route::post('gallery', [GalleryController::class, 'store'])->name('gallery');
    Route::patch('gallery/{post}', [GalleryController::class, 'update'])->name('gallery-update');

    Route::post('code', [CodeController::class, 'store'])->name('code');
    Route::patch('code/{post}', [CodeController::class, 'update'])->name('code-update');

    Route::post('article', [ArticleController::class, 'store'])->name('article');
    Route::patch('article/{post}', [ArticleController::class, 'update'])->name('article-update');

    Route::delete('{post}', [PostController::class, 'delete'])->name('delete');

    Route::post('ping/{post}', [PostController::class, 'ping'])->name('ping');
    Route::post('unping/{post}', [PostController::class, 'unping'])->name('unping');

    Route::post('fork/{post}', [PostController::class, 'fork'])->name('fork');
    Route::delete('fork/{post}', [PostController::class, 'deleteFork'])->name('fork-delete');

    Route::post('stash/{type}/{id}', [StashController::class, 'store'])->name('stash');
    Route::delete('stash/{type}/{id}', [StashController::class, 'delete'])->name('stash-delete');
});

Route::group(['prefix' => 'settings', 'middleware' => ['auth'], 'as' => 'settings.'], function () {
    Route::get('/personal-data', [AccountController::class, 'accountDataForm'])->name('account-data');
    Route::get('/change-password', [AccountController::class, 'changePasswordForm'])->name('change-password')->middleware('password.confirm');
    Route::patch('/personal-data', [AccountController::class, 'personalInfoPost'])->name('personal-information');
    Route::patch('/password-change', [AccountController::class, 'passwordChangePost'])->name('password-change');
    Route::post('/delete-account', [AccountController::class, 'deleteAccountPost'])->name('delete-account');
    Route::patch('/gender-pronoun', [AccountController::class, 'genderPronounPost'])->name('gender-pronoun');
    Route::patch('/update-bio', [AccountController::class, 'updateBio'])->name('update-bio');

    Route::get('/avatars-banners', [MediaController::class, 'show'])->name('avatars-banners');
    Route::post('/avatars-banners', [AvatarController::class, 'store'])->name('avatar-upload');
    Route::post('/avatar-change', [AvatarController::class, 'update'])->name('avatar-change');
    Route::post('/banners', [BannerController::class, 'store'])->name('banner-upload');
    Route::post('/banner-change', [BannerController::class, 'update'])->name('banner-change');
    Route::post('/banner-delete', [BannerController::class, 'delete'])->name('banner-delete');
    Route::post('/banner-coordinate-change', [BannerController::class, 'updateCoords'])->name('banner-coordinate-change');

    Route::get('/looks', [AppearanceController::class, 'show'])->name('looks');
    Route::patch('/colour-scheme', [ColourSchemeController::class, 'update'])->name('colour-scheme-change');
    Route::patch('/max-post-size', [MaxSizeController::class, 'update'])->name('max-post-size-change');
    Route::patch('/font', [FontController::class, 'update'])->name('font-change');
    Route::patch('/background', [BackgroundController::class, 'update'])->name('background-change');
    Route::patch('/flash-message', [FlashMessageController::class, 'update'])->name('flash-message-change');

    Route::get('/privacy', [PrivacyController::class, 'show'])->name('privacy');
    Route::patch('/toggle-visibility', [PrivacyController::class, 'toggleVisibility'])->name('toggle-visibility');
    Route::patch('/approve-follow', [PrivacyController::class, 'approveFollow'])->name('approve-follow');
    Route::patch('/toggle-displayed', [PrivacyController::class, 'toggleDisplayed'])->name('toggle-displayed');
});

require __DIR__.'/auth.php';

