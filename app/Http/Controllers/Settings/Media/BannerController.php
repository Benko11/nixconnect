<?php

namespace App\Http\Controllers\Settings\Media;

use App\Http\Controllers\Controller;
use App\Models\UserBanner;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class BannerController extends Controller
{
    public function store() {
        request()->validate([
            'banner' => ['required', 'max:'.config('app.banner_max_size')]
        ]);

        $file = request()->file('banner');
        $hashName = $file->hashName();
        $file->store('banners');

        auth()->user()->addBanner($hashName);
        $banner = auth()->user()->banners()->latest()->first();
        auth()->user()->activateBanner($banner);

        return redirect()->back();
    }

    public function update() {
        request()->validate([
            'id' => ['required']
        ], [
            'id.required' => 'Please select an image'
        ]);

        $banner = UserBanner::find(request()->get('id'));
        $userUuid = $banner->user_uuid;
        if (auth()->user()->uuid != $userUuid) {
            abort(Response::HTTP_UNAUTHORIZED);
        }

        auth()->user()->activateBanner(UserBanner::find($banner)->first());

        return redirect()->back();  
    }

    public function delete() {
        request()->validate([
            'id' => ['required']
        ], [
            'id.required' => 'Please select an image'
        ]);

        $banner = UserBanner::find(request()->get('id'));
        $userUuid = $banner->user_uuid;
        if (auth()->user()->uuid != $userUuid) {
            abort(Response::HTTP_UNAUTHORIZED);
        }

        auth()->user()->deactivateBanner();
        Storage::delete('public/banners/' . $banner->name);
        $banner->delete();
    }

    public function updateCoords() {
        $validatedData = request()->validate([
            'posX' => ['required', 'numeric', 'between:0,1'],
            'posY' => ['required', 'numeric', 'between:0,1'],
        ], [
            '*.between' => 'Please insert a value between 0 and 1 (to symbolize the 0%-100% offset)',
        ]);

        auth()->user()->media()->update(['banner_pos_x' => request('posX'), 'banner_pos_y' => request('posY')]);

        return redirect()->back();
    }
}
