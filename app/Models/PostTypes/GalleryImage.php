<?php

namespace App\Models\PostTypes;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GalleryImage extends Model
{
    use HasFactory;

    protected $table = 'posts_gallery_images';
    public $timestamps = false;
    protected $fillable = ['file_name', 'description'];

    public function postGallery() {
        return $this->belongsTo(Gallery::class, 'post_gallery_id');
    }
}
