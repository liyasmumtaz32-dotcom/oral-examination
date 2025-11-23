import React from 'react';
import { Student } from '../types';
import { FileText } from 'lucide-react';

interface ExportViewProps {
  students: Student[];
  currentExaminer: string;
  examDate: string;
}

export const ExportView: React.FC<ExportViewProps> = ({ students, currentExaminer, examDate }) => {
  
  // Format Date Function (Indonesia)
  const getFormattedDate = (dateString: string) => {
    if (!dateString) return '......................';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formattedDate = getFormattedDate(examDate);

  const handleExportWord = () => {
    const tableRows = students.map((student, index) => {
        const total = (Object.values(student.scores) as number[]).reduce((a, b) => a + b, 0);
        const avg = total / 5;
        return `
            <tr>
                <td style="text-align: center;">${index + 1}</td>
                <td style="text-align: left;">${student.name}</td>
                <td style="text-align: center;">${student.examiner || '-'}</td>
                <td style="text-align: center;">${student.scores.muhadatsah || ''}</td>
                <td style="text-align: center;">${student.scores.mutholaah || ''}</td>
                <td style="text-align: center;">${student.scores.nahwu || ''}</td>
                <td style="text-align: center;">${student.scores.shorof || ''}</td>
                <td style="text-align: center;">${student.scores.tarjamah || ''}</td>
                <td style="text-align: center; font-weight: bold; background-color: #f9fafb;">${total > 0 ? total : ''}</td>
                <td style="text-align: center; font-weight: bold; background-color: #f9fafb;">${total > 0 ? avg.toFixed(1) : ''}</td>
            </tr>
        `;
    }).join('');

    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>Laporan Ujian Lisan</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; }
          .arabic { font-family: 'Traditional Arabic', 'Amiri', serif; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid black; padding: 6px; font-size: 11pt; }
          th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
          .header { text-align: center; margin-bottom: 20px; }
          .title-arabic { font-size: 22pt; font-weight: bold; margin: 0; }
          .subtitle-arabic { font-size: 18pt; margin: 5px 0; }
          .meta-info-container { text-align: center; margin-top: 15px; }
          .meta-info { font-weight: bold; text-transform: uppercase; border-bottom: 1px solid black; padding-bottom: 5px; display: inline-block; }
          .footer { margin-top: 50px; text-align: right; }
          .signature-box { display: inline-block; text-align: center; width: 250px; }
        </style>
      </head>
      <body>
        <div class="header">
           <p class="arabic title-arabic" dir="rtl">دفتر النتيجة للإمتحان الشفهي</p>
           <p class="arabic subtitle-arabic" dir="rtl">معهد الغزالي العصري للتربية الإسلامية الحديثة</p>
           <div class="meta-info-container">
             <span class="meta-info">Materi : Bahasa Arab – Kelas 5D</span>
           </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th width="5%">No</th>
                    <th width="25%">NAMA PESERTA</th>
                    <th width="15%">PENGUJI</th>
                    <th width="9%">Muhadatsah</th>
                    <th width="9%">Muttholaa'h</th>
                    <th width="9%">Nahwu</th>
                    <th width="9%">Shorof</th>
                    <th width="9%">Tarjamah</th>
                    <th width="5%">Total</th>
                    <th width="5%">Rata2</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>

        <div class="footer">
            <div class="signature-box">
                <p>Gunungsindur, ${formattedDate}</p>
                <p>Penguji:</p>
                <br><br><br><br>
                <p style="border-bottom: 1px solid black;">( ${currentExaminer || '......................'} )</p>
            </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_Ujian_Lisan_5D_${examDate}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Cetak Laporan</h1>
        <button 
            onClick={handleExportWord}
            className="flex items-center gap-2 bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition shadow-sm"
        >
            <FileText className="w-5 h-5" /> Export ke Microsoft Word
        </button>
      </div>

      <div className="bg-white p-8 shadow-sm rounded-xl border border-gray-100 overflow-x-auto">
        {/* Header Arabic */}
        <div className="text-center mb-6 space-y-2">
            <h1 className="text-2xl font-bold font-arabic">دفتر النتيجة للإمتحان الشفهي</h1>
            <h2 className="text-xl font-arabic">معهد الغزالي العصري للتربية الإسلامية الحديثة</h2>
            <div className="flex justify-center items-center gap-2 mt-4 border-b-2 border-black pb-4 w-full">
                <h3 className="text-lg font-bold uppercase tracking-wide">Materi : Bahasa Arab – Kelas 5D</h3>
            </div>
        </div>

        {/* Table */}
        <table className="w-full border-collapse border border-black text-sm">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border border-black px-2 py-2 text-center w-10">No</th>
                    <th className="border border-black px-3 py-2 text-left">NAMA PESERTA</th>
                    <th className="border border-black px-2 py-2 text-center w-32">PENGUJI</th>
                    <th className="border border-black px-2 py-2 text-center w-24">Muhadatsah</th>
                    <th className="border border-black px-2 py-2 text-center w-24">Muttholaa'h</th>
                    <th className="border border-black px-2 py-2 text-center w-20">Nahwu</th>
                    <th className="border border-black px-2 py-2 text-center w-20">Shorof</th>
                    <th className="border border-black px-2 py-2 text-center w-24">Tarjamah & Mufrodat</th>
                    <th className="border border-black px-2 py-2 text-center w-16 bg-gray-50">Nilai Total</th>
                    <th className="border border-black px-2 py-2 text-center w-16 bg-gray-50">RATA-RATA</th>
                </tr>
            </thead>
            <tbody>
                {students.map((student, index) => {
                    const total = (Object.values(student.scores) as number[]).reduce((a, b) => a + b, 0);
                    const avg = total / 5;
                    return (
                        <tr key={student.id}>
                            <td className="border border-black px-2 py-1 text-center">{index + 1}</td>
                            <td className="border border-black px-3 py-1 font-medium">{student.name}</td>
                            <td className="border border-black px-2 py-1 text-center">{student.examiner}</td>
                            <td className="border border-black px-2 py-1 text-center">{student.scores.muhadatsah || ''}</td>
                            <td className="border border-black px-2 py-1 text-center">{student.scores.mutholaah || ''}</td>
                            <td className="border border-black px-2 py-1 text-center">{student.scores.nahwu || ''}</td>
                            <td className="border border-black px-2 py-1 text-center">{student.scores.shorof || ''}</td>
                            <td className="border border-black px-2 py-1 text-center">{student.scores.tarjamah || ''}</td>
                            <td className="border border-black px-2 py-1 text-center font-bold bg-gray-50">{total > 0 ? total : ''}</td>
                            <td className="border border-black px-2 py-1 text-center font-bold bg-gray-50">{total > 0 ? avg.toFixed(1) : ''}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>

        {/* Footer */}
        <div className="mt-12 flex justify-end">
            <div className="text-center w-64">
                <p className="mb-16">Gunungsindur, {formattedDate}<br/>Penguji:</p>
                <p className="border-b border-black inline-block min-w-[200px]"></p>
                <p className="mt-1 font-bold">( {currentExaminer || '......................'} )</p>
            </div>
        </div>
      </div>
    </div>
  );
};