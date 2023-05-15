<?php

namespace App\Models;

use App\Http\Traits\CreatesPosts;
use App\Http\Traits\CustomizableProfile;
use App\Http\Traits\Followable;
use App\Http\Traits\Genderable;
use App\Http\Traits\HasPreferences;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, HasUuids, SoftDeletes, CustomizableProfile, CreatesPosts, Genderable, Followable, HasPreferences;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nickname',
        'first_name',
        'last_name',
        'email',
        'password',
        'bio',
        'date_of_birth',
        'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $with = ['genders', 'pronouns', 'preferences'];
    
    protected $primaryKey = 'uuid';

    public function scopeFilter($query, array $filters) {
        if ($filters['search'] ?? false) {

        }
    }

    public function getRouteKeyName()
    {
        return 'nickname';
    }

    public function setPasswordAttribute(string $password) {
        $this->attributes['password'] = Hash::make($password);
    }

    public function facts() {
        return $this->belongsToMany(Fact::class)->withPivot('value');
    }

    public function addFact($fact) {
        $category = $fact[0];
        $value = $fact[1];

        $exists = Fact::where('category', $category)->count() > 0;
        if (!$exists) Fact::create(['category' => $category]);

        $filteredCategory = Fact::where('category', $category)->first();
        return $this->facts()->attach($this->uuid, ['fact_id' => $filteredCategory->id, 'value' => $value]);
    }

    public function hashtags() {
        return $this->hasMany(Hashtag::class, 'author_uuid');
    }

    public function addHashtag(string $hashtag) {
        $hashtagObj = new Hashtag(['name' => $hashtag]);
        $this->hashtags()->save($hashtagObj);
    }

    public function isToured() {
        return $this->toured_at != null;
    }

    public function completeTour() {
        $this->toured_at = now();
        $this->save();
    }

    public function stashes() {
        return $this->hasMany(Stash::class);
    }

    public function stashedPosts() {
        return $this->morphMany(Post::class, 'stashable');
    }


    public function stashedForks() {
        return $this->morphMany(Fork::class, 'stashable');
    }

    public function stash($resource) {
        $resourceType = 'post';
        if ($resource instanceof Fork) {
            $resourceType = 'fork';
        }

        $this->stashes()->save(new Stash(['stashable_type' => $resourceType, 'stashable_id' => $resource->id]));
    }

    public function unstash($resource) {
        $stash = Stash::where('stashable_id', $resource->id)->where('user_uuid', auth()->id());
        $stash->delete();
    }
}
