<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Public Landing Page & CMS Routes
Route::get('/', [HomeController::class, 'index'])->name('home');

// Lead & Inquiry Submission
Route::post('/inquiry', [InquiryController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('inquiry.store');

// Newsletter Subscription & One-Click Unsubscribe
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])
    ->middleware('throttle:15,1')
    ->name('newsletter.subscribe');
Route::get('/newsletter/unsubscribe/{token}', [NewsletterController::class, 'unsubscribe'])
    ->name('newsletter.unsubscribe');

// Dashboard redirect for auth
Route::redirect('/dashboard', '/admin/dashboard')->middleware(['auth'])->name('dashboard');

// Admin Authenticated Dashboard & CMS Routes
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/inquiries', [\App\Http\Controllers\Admin\AdminInquiryController::class, 'index'])->name('inquiries.index');
    Route::patch('/inquiries/{inquiry}', [\App\Http\Controllers\Admin\AdminInquiryController::class, 'update'])->name('inquiries.update');
    Route::delete('/inquiries/{inquiry}', [\App\Http\Controllers\Admin\AdminInquiryController::class, 'destroy'])->name('inquiries.destroy');
    Route::get('/subscribers', [\App\Http\Controllers\Admin\AdminSubscriberController::class, 'index'])->name('subscribers.index');
    Route::delete('/subscribers/{subscriber}', [\App\Http\Controllers\Admin\AdminSubscriberController::class, 'destroy'])->name('subscribers.destroy');
    Route::get('/subscribers/export', [\App\Http\Controllers\Admin\AdminSubscriberController::class, 'exportCsv'])->name('subscribers.export');
    Route::get('/projects', [\App\Http\Controllers\Admin\AdminProjectController::class, 'index'])->name('projects.index');
    Route::post('/projects', [\App\Http\Controllers\Admin\AdminProjectController::class, 'store'])->name('projects.store');
    Route::put('/projects/{project}', [\App\Http\Controllers\Admin\AdminProjectController::class, 'update'])->name('projects.update');
    Route::delete('/projects/{project}', [\App\Http\Controllers\Admin\AdminProjectController::class, 'destroy'])->name('projects.destroy');
    Route::get('/capabilities', [\App\Http\Controllers\Admin\AdminCapabilityController::class, 'index'])->name('capabilities.index');
    Route::put('/capabilities/{capability}', [\App\Http\Controllers\Admin\AdminCapabilityController::class, 'update'])->name('capabilities.update');
    Route::get('/faqs', [\App\Http\Controllers\Admin\AdminFaqController::class, 'index'])->name('faqs.index');
    Route::post('/faqs', [\App\Http\Controllers\Admin\AdminFaqController::class, 'store'])->name('faqs.store');
    Route::put('/faqs/{faq}', [\App\Http\Controllers\Admin\AdminFaqController::class, 'update'])->name('faqs.update');
    Route::delete('/faqs/{faq}', [\App\Http\Controllers\Admin\AdminFaqController::class, 'destroy'])->name('faqs.destroy');
    Route::get('/sections', [\App\Http\Controllers\Admin\AdminSectionController::class, 'index'])->name('sections.index');
    Route::post('/sections', [\App\Http\Controllers\Admin\AdminSectionController::class, 'update'])->name('sections.update');
    Route::get('/settings', [\App\Http\Controllers\Admin\AdminSettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [\App\Http\Controllers\Admin\AdminSettingController::class, 'update'])->name('settings.update');
});

// User Profile Routes (Breeze)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
