<?php

namespace App\Models\PostTypes;

use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    use HasFactory;

    protected $table = 'posts_gallery';
    protected $fillable = ['contents'];
    public $timestamps = false;

    protected $with = ['images'];

    public function post() {
        return $this->morphOne(Post::class, 'postable');
    }

    public function images() {
        return $this->hasMany(GalleryImage::class, 'post_gallery_id');
    }

    public function addImage(string $image, string $description = null) {
        $this->images()->save(new GalleryImage(['file_name' => $image, 'description' => $description]));
    }
}
