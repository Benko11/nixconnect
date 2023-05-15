<?php

namespace App\Http\Controllers\Settings\Media;

use App\Http\Controllers\Controller;
use App\Models\UserAvatar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class AvatarController extends Controller
{
    public function store() {
        request()->validate([
            'avatar' => ['required', 'max:'.config('app.avatar_max_size')]
        ]);
        
        $file = request()->file('avatar');
        $hashName = $file->hashName();
        $file->store('avatars');

        auth()->user()->addAvatar($hashName);
        $avatar = auth()->user()->avatars()->latest()->first();
        auth()->user()->activateAvatar($avatar);

        return redirect()->back();
    }

    public function update() {
        request()->validate([
            'id' => ['required']
        ], [
            'id.required' => 'Please select an image'
        ]);

        $avatar = UserAvatar::find(request()->get('id'));
        $userUuid = $avatar->user_uuid;
        if (auth()->user()->uuid != $userUuid) {
            abort(Response::HTTP_UNAUTHORIZED);
        }

        if (request()->get('action') == 'activate') {
            auth()->user()->activateAvatar(UserAvatar::find($avatar)->first());
        }

        if (request()->get('action') == 'delete') {
            auth()->user()->deactivateAvatar();
            Storage::delete('avatars/' . $avatar->name);
            $avatar->delete();
        }

        return redirect()->back();  
    }
}
