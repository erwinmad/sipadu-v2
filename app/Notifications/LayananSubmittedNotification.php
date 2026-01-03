<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LayananSubmittedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $layananName;
    protected $token;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $layananName, string $token)
    {
        $this->layananName = $layananName;
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Permohonan Layanan Berhasil Dikirim - SIPADU')
                    ->greeting('Halo, ' . $notifiable->name . '!')
                    ->line('Terima kasih telah mengajukan permohonan **' . $this->layananName . '** melalui SIPADU Kabupaten Cianjur.')
                    ->line('Permohonan Anda telah berhasil kami terima dan sedang dalam proses verifikasi.')
                    ->line('')
                    ->line('**Token Permohonan Anda:**')
                    ->line('# ' . $this->token)
                    ->line('')
                    ->line('Simpan token ini dengan baik untuk melacak status permohonan Anda.')
                    ->action('Lacak Permohonan', url('/tracking?token=' . $this->token))
                    ->line('')
                    ->line('**Informasi Penting:**')
                    ->line('• Permohonan akan diverifikasi dalam 1-3 hari kerja')
                    ->line('• Anda akan menerima notifikasi email jika ada update status')
                    ->line('• Pastikan data yang Anda berikan valid dan dapat dihubungi')
                    ->line('')
                    ->line('Jika Anda memiliki pertanyaan, silakan hubungi layanan pengaduan kami.')
                    ->salutation('Salam, Tim SIPADU Kabupaten Cianjur');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'layanan_name' => $this->layananName,
            'token' => $this->token,
        ];
    }
}
