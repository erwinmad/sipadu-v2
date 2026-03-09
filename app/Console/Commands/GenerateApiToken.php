<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class GenerateApiToken extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'api:generate-token 
                            {email : The email of the user}
                            {--name=simweb-access : The name of the token}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate API token for a user to access SIPADU API from SIMWEB';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $tokenName = $this->option('name');

        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User with email {$email} not found!");
            return 1;
        }

        // Check if user has kecamatan
        if (!$user->kode_kecamatan) {
            $this->warn("Warning: User does not have a kecamatan assigned!");
            $this->warn("API will return 403 error when accessing permohonan endpoints.");
            
            if (!$this->confirm('Do you want to continue?', false)) {
                return 1;
            }
        }

        // Revoke existing tokens with the same name
        $user->tokens()->where('name', $tokenName)->delete();

        // Create new token
        $token = $user->createToken($tokenName);

        $this->info('API Token generated successfully!');
        $this->newLine();
        
        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->line('  User Details');
        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->line("  Name         : {$user->name}");
        $this->line("  Email        : {$user->email}");
        $this->line("  Kecamatan    : " . ($user->kecamatan->nama_kecamatan ?? 'Not assigned'));
        $this->line("  Kode         : " . ($user->kode_kecamatan ?? 'N/A'));
        $this->newLine();
        
        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->line('  Token Information');
        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->line("  Token Name   : {$tokenName}");
        $this->newLine();
        
        $this->warn('  ⚠️  IMPORTANT: Copy this token now. It will not be shown again!');
        $this->newLine();
        
        $this->line('  <fg=green>Token:</>');
        $this->line("  <fg=yellow>{$token->plainTextToken}</>");
        $this->newLine();
        
        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->line('  Usage in SIMWEB (.env)');
        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->line('  SIPADU_API_URL=' . config('app.url') . '/api');
        $this->line("  SIPADU_API_TOKEN={$token->plainTextToken}");
        $this->newLine();

        return 0;
    }
}
