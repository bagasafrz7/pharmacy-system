// src/components/receipt-print-dialog.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Printer, X } from "lucide-react"
import React, { useRef } from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale" // Tambahkan locale id jika Anda menggunakannya

// Asumsi struktur TransactionData
interface TransactionData {
    transaction_number: string;
    member_id: string | null;
    total: number;
    subtotal: number;
    tax: number;
    amount_received: number;
    change: number;
    payment_method: string;
    items: Array<{ product_id: string; quantity: number; price: number; total: number; }>;
    created_at: string;
}

interface ReceiptPrintDialogProps {
    transactionData: TransactionData | null;
    onClose: () => void;
}

// Fungsi Helper untuk format Rupiah (duplikasi agar komponen independen)
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export function ReceiptPrintDialog({ transactionData, onClose }: ReceiptPrintDialogProps) {
    const receiptRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        if (receiptRef.current) {
            // Memicu cetak bawaan browser
            window.print();
        }
    };

    const open = !!transactionData;

    if (!transactionData) return null;

    const transactionTime = new Date(transactionData.created_at);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xs p-0 print:m-0 print:p-0 print:w-auto print:max-w-none">
                
                {/* Bagian yang akan dicetak */}
                <div ref={receiptRef} className="p-4 print:p-0 print:text-[10pt] print:leading-tight">
                    <DialogHeader className="text-center pt-4 pb-2 print:pt-0">
                        <DialogTitle className="text-lg font-bold print:text-base">PharmaCare</DialogTitle>
                        <p className="text-xs text-muted-foreground print:text-[8pt]">
                            Jl. Kesehatan No. 123, Jakarta Selatan
                        </p>
                        <p className="text-xs text-muted-foreground print:text-[8pt]">
                            Telp: (021) 1234 5678
                        </p>
                    </DialogHeader>

                    <Separator className="my-2 print:my-1" />

                    {/* Info Transaksi */}
                    <div className="text-sm space-y-1 print:text-[9pt]">
                        <p>No. Transaksi: <span className="float-right">{transactionData.transaction_number}</span></p>
                        <p>Tanggal: <span className="float-right">
                            {format(transactionTime, 'dd/MM/yyyy HH:mm', { locale: id })}
                        </span></p>
                        <p>Pelanggan: <span className="float-right">
                            {transactionData.member_id === 'guest' ? 'Tamu' : transactionData.member_id ? `Anggota (${transactionData.member_id})` : 'Umum'}
                        </span></p>
                    </div>

                    <Separator className="my-2 print:my-1" />

                    {/* Detail Item */}
                    <div className="space-y-1 print:space-y-0.5 print:text-[9pt]">
                        <div className="flex justify-between font-medium pb-1 border-b print:border-b-0">
                            <span>Item ({transactionData.items.length})</span>
                            <span>Total</span>
                        </div>
                        {transactionData.items.map((item, index) => (
                            <div key={index} className="space-y-0.5">
                                <p className="font-medium">{item.name}</p>
                                <div className="flex justify-between text-muted-foreground text-xs print:text-[8pt]">
                                    <span>{item.quantity} x {formatRupiah(item.price)}</span>
                                    <span>{formatRupiah(item.total)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Separator className="my-2 print:my-1" />

                    {/* Total Pembayaran */}
                    <div className="space-y-1 text-sm font-medium print:text-[9pt]">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>{formatRupiah(transactionData.subtotal)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span>Pajak (11%):</span>
                            <span>{formatRupiah(transactionData.tax)}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold pt-1 border-t">
                            <span>TOTAL:</span>
                            <span>{formatRupiah(transactionData.total)}</span>
                        </div>
                    </div>

                    <Separator className="my-2 print:my-1" />

                    {/* Detail Pembayaran */}
                     <div className="space-y-1 text-sm print:text-[9pt]">
                        <p>Metode Pembayaran: <span className="float-right font-medium">{transactionData.payment_method}</span></p>
                        <p>Diterima: <span className="float-right font-medium">{formatRupiah(transactionData.amount_received)}</span></p>
                        <p>Kembalian: <span className="float-right font-medium">{formatRupiah(transactionData.change)}</span></p>
                    </div>

                    <Separator className="my-2 print:my-1" />
                    
                    <p className="text-center text-xs pt-1 print:text-[8pt] italic">
                        Terima kasih atas kunjungan Anda.
                    </p>
                </div>

                {/* Footer Dialog (Hanya tampil di layar) */}
                <DialogFooter className="flex-row justify-between p-4 border-t print:hidden">
                    <Button variant="outline" onClick={onClose}>
                        <X className="mr-2 h-4 w-4" />
                        Tutup
                    </Button>
                    <Button onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Cetak Struk
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}