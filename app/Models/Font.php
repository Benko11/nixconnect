<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Font extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $fillable = ['name', 'type', 'url'];

    public function users() {
        return $this->hasMany(User::class);
    }
}
