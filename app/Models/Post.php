<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Post extends Model
{
    use HasFactory;

    protected $fillable = ['postable_type', 'postable_id'];

    protected $with = ['postable', 'owner', 'pings'];

    protected $appends = ['human_at'];

    public function getHumanAtAttribute() {
        return $this->created_at->diffForHumans();
    }

    public function owner() {
        return $this->belongsTo(User::class, 'user_uuid');
    }

    public function postable() {
        return $this->morphTo('postable');
    }

    public function fullDelete() {
        if ($this->postable->images) {
            foreach ($this->postable->images as $image) {
                Storage::delete('posts/' . $image->file_name);
                $image->delete();
            }
        }

        Stash::where('stashable_id', $this->id)->delete();
        $this->postable->delete();
        $this->delete();
    }

    public function pings() {
        return $this->hasMany(Ping::class);
    }

    public function forks() {
        return $this->hasMany(Fork::class);
    }

    public function ping() {
        $ping = new Ping();
        $ping->user_uuid = auth()->id();
        $this->pings()->save($ping);
    }

    public function unping() {
        Ping::where(['user_uuid' => auth()->id(), 'post_id' => $this->id])->delete();
    }

    public function fork(string $description = null) {
        $fork = new Fork();
        $fork->user_uuid = auth()->id();
        if ($description)
            $fork->description = $description;
            
        $this->forks()->save($fork);
    }
}
