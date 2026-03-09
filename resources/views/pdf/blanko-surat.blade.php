<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Surat Keterangan {{ ucfirst($jenis) }}</title>
    <style>
        /* Base Styling */
        @page { 
            size: A4; /* Secara eksplisit atur ukuran kertas ke A4 */
            margin: 1.5cm 2cm 2.5cm 2cm; /* Compact margin minimal Atas bawah, space untuk footer */
        } 
        body { 
            font-family: "Times New Roman", Times, serif; 
            font-size: 11pt; /* Dikecilkan jadi 11 supaya lebih muat banyak */
            line-height: 1.3; /* Line height juga dikurangi sedikit */
            color: #000;
        }
        
        /* Kop Surat (Header) */
        .kop-surat { width: 100%; display: table; margin-bottom: 3px; }
        .kop-logo { display: table-cell; width: 12%; vertical-align: middle; text-align: left; }
        .kop-logo img { width: 70px; height: auto; }
        .kop-text { display: table-cell; width: 88%; vertical-align: middle; text-align: center; padding-right: 12%; }
        
        .kop-text h1 { font-size: 15pt; font-weight: bold; margin: 0; letter-spacing: 0.5px; }
        .kop-text h2 { font-size: 13pt; font-weight: bold; margin: 2px 0; }
        .kop-text p { font-size: 10pt; margin: 0; }
        
        /* Garis Ganda Koo Surat */
        .garis-kop {
            border-top: 3px solid #000;
            border-bottom: 1px solid #000;
            height: 2px;
            width: 100%;
            margin-bottom: 15px; /* Compact */
        }
        
        /* Judul Surat */
        .judul-surat { text-align: center; margin-bottom: 15px; }
        .judul-surat h3 { font-size: 13pt; font-weight: bold; text-decoration: underline; text-transform: uppercase; margin: 0; padding: 0; }
        .judul-surat p { font-size: 11pt; margin: 2px 0 0 0; }
        
        /* Isi Surat */
        .isi-surat { text-align: justify; }
        .paragraf { text-indent: 40px; margin-bottom: 8px; }
        
        /* Tabel Data Diri */
        .tabel-data { width: 95%; margin: 10px auto; border-collapse: collapse; }
        .tabel-data td { padding: 3px 0; vertical-align: top; }
        .td-label { width: 33%; }
        .td-titikdua { width: 2%; text-align: center; }
        .td-value { width: 65%; font-weight: bold; }
        
        /* Tanda Tangan */
        .area-ttd { width: 100%; margin-top: 25px; page-break-inside: avoid; }
        .box-ttd { float: right; width: 45%; text-align: left; padding-left: 20px; }
        .box-ttd p { margin: 0; line-height: 1.3; }
        .spasi-ttd { height: 60px; } /* SPasi ringkas */
        .nama-pejabat { font-size: 11pt; font-weight: bold; text-decoration: underline; margin: 0; }
        .clear { clear: both; }

        /* Document Footer Berulang - DomPDF support */
        footer {
            position: fixed;
            bottom: 0px; /* Diangkat sedikit agar tidak terpotong (paskan di bibir margin batas bawah) */
            left: 0;
            right: 0;
            width: 100%;
            border-top: 2px solid #059669; /* Garis tipis modern */
            padding-top: 8px;
            display: table;
            font-family: Arial, Helvetica, sans-serif;
        }
        .footer-logo-bsre { display: table-cell; width: 140px; vertical-align: middle; text-align: left; }
        .footer-logo-bsre img { width: auto; height: 50px; }
        .footer-qr { display: table-cell; width: 60px; vertical-align: middle; text-align: left; }
        .footer-qr img { width: 50px; height: 50px; }
        .footer-teks { display: table-cell; vertical-align: middle; padding-left: 10px; text-align: justify; }
        .footer-teks p { font-size: 7.5pt; color: #4b5563; line-height: 1.3; margin: 0; }
        .footer-teks b { color: #000; }
        .footer-link { color: #059669; text-decoration: none; font-weight: bold; }
    </style>
</head>
<body>

    <?php 
        \Carbon\Carbon::setLocale('id');
        $now = \Carbon\Carbon::now();
        
        // Logo Cianjur
        $logoPath = public_path('logo/sugih-mukti.png');
        $logoData = base64_encode(file_get_contents($logoPath));
        $src = 'data:image/png;base64,'.$logoData;
        
        // Logo BSRE
        $logoBsrePath = public_path('images/logo-bsre.png');
        $srcBsre = '';
        if (file_exists($logoBsrePath)) {
            $logoBsreData = base64_encode(file_get_contents($logoBsrePath));
            $srcBsre = 'data:image/png;base64,'.$logoBsreData;
        }
    ?>

    <!-- Verifikasi Khusus Print (Selalu muncul di dasar SEMUA HALAMAN) -->
    <footer>
        @if($srcBsre)
        <div class="footer-logo-bsre">
            <img src="{{ $srcBsre }}" alt="BSrE">
        </div>
        @endif
        <div class="footer-qr">
            <img src="{{ $qrCode }}" alt="QR">
        </div>
        <div class="footer-teks">
            <p>
                <b>Dokumen Resmi SIPADU Kabupaten Cianjur</b><br>
                Surat ini diterbitkan secara elektronik dan dicetak pada <b>{{ $now->isoFormat('D MMMM Y HH:mm:ss') }}</b>.<br>
                Keaslian dan keabsahan dokumen dapat diverifikasi secara online melalui tautan <span class="footer-link">{{ url('/verifikasi/' . $permohonan->token) }}</span> atau dengan memindai <i>QR Code</i> di samping.
            </p>
        </div>
    </footer>

    <main>
        <div class="kop-surat">
            <div class="kop-logo">
                <img src="{{ $src }}" alt="Logo Cianjur">
            </div>
            <div class="kop-text">
                <h1>PEMERINTAH KABUPATEN CIANJUR</h1>
                <h2>KECAMATAN {{ strtoupper($permohonan->kecamatan->nama_kecamatan ?? (auth()->user()->kecamatan->nama_kecamatan ?? 'KECAMATAN')) }}</h2>
                <p>Jalan Raya {{ ucwords(strtolower($permohonan->kecamatan->nama_kecamatan ?? (auth()->user()->kecamatan->nama_kecamatan ?? 'Kecamatan'))) }} No. 123 Kode Pos 43252</p>
            </div>
        </div>
        
        <div class="garis-kop"></div>

        <div class="judul-surat">
            <h3>SURAT KETERANGAN {{ strtoupper($jenis) }}</h3>
            <p>Nomor : {{ $permohonan->no_surat ?? '400 / ................ / ' . date('Y') }}</p>
        </div>

        <div class="isi-surat">
            <p class="paragraf">Yang bertanda tangan di bawah ini Camat {{ ucwords(strtolower($permohonan->kecamatan->nama_kecamatan ?? (auth()->user()->kecamatan->nama_kecamatan ?? 'Kecamatan'))) }}, Kabupaten Cianjur, menerangkan dengan sebenarnya bahwa:</p>
            
            <table class="tabel-data">
                <tr>
                    <td class="td-label">Nama Lengkap</td>
                    <td class="td-titikdua">:</td>
                    <td class="td-value">{{ strtoupper($permohonan->user->name ?? '-') }}</td>
                </tr>
                <tr>
                    <td class="td-label">Pekerjaan</td>
                    <td class="td-titikdua">:</td>
                    <td class="td-value">{{ ucwords(strtolower($detail['pekerjaan'] ?? 'Wiraswasta / Pegawai')) }}</td>
                </tr>
                <tr>
                    <td class="td-label">Alamat Lengkap</td>
                    <td class="td-titikdua">:</td>
                    <td class="td-value">Desa {{ ucwords(strtolower($permohonan->desa->nama_desa ?? '-')) }}, Kec. {{ ucwords(strtolower($permohonan->kecamatan->nama_kecamatan ?? '-')) }}, Kab. Cianjur</td>
                </tr>
                
                @php $count = 0; @endphp
                @foreach($detail as $key => $value)
                    @if(!in_array($key, ['pekerjaan', 'nik', 'tanggal_lahir', 'tempat_lahir']))
                        <?php 
                            if ($count >= 5) break; 
                            $count++;
                        ?>
                        <tr>
                            <td class="td-label">{{ ucwords(str_replace('_', ' ', $key)) }}</td>
                            <td class="td-titikdua">:</td>
                            <td class="td-value">{{ ucwords(strtolower($value)) }}</td>
                        </tr>
                    @endif
                @endforeach
            </table>

            <p class="paragraf">Berdasarkan pengajuan perihal surat keterangan tersebut (<i>No. Registrasi: <b>{{ $permohonan->token }}</b></i>), yang bersangkutan adalah benar berdomisili di wilayah administrasi kami dan seluruh spesifikasi data pendukung yang telah dilampirkan telah diverifikasi serta sesuai dengan catatan lembaga administrasi desa setempat.</p>
            
            <p class="paragraf">Demikian Surat Keterangan ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya oleh pihak yang berkepentingan.</p>
        </div>

        <div class="area-ttd">
            <div class="box-ttd">
                <p>{{ ucwords(strtolower($permohonan->kecamatan->nama_kecamatan ?? (auth()->user()->kecamatan->nama_kecamatan ?? 'Kecamatan'))) }}, {{ $now->isoFormat('D MMMM Y') }}</p>
                <p><strong>Camat {{ ucwords(strtolower($permohonan->kecamatan->nama_kecamatan ?? (auth()->user()->kecamatan->nama_kecamatan ?? 'Kecamatan'))) }}</strong></p>
                
                <div class="spasi-ttd"></div>
                
                <p class="nama-pejabat">{{ strtoupper(auth()->user()->name ?? 'NAMA PEJABAT') }}</p>
                <p>NIP. {{ auth()->user()->nik ?? '19800101 200501 1 001' }}</p>
            </div>
            <div class="clear"></div>
        </div>
    </main>

</body>
</html>
