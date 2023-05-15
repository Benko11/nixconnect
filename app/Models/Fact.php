<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fact extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $fillable = ['category', 'value'];

    public function users() {
        return $this->belongsToMany(User::class);
    }
}
