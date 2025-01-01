import { jsPDF } from 'jspdf';

export const generateDeckForm = (deck) => {
  const doc = new jsPDF();
  
  // Set font styles
  doc.setFont('helvetica', 'normal');
  
  // Title
  doc.setFontSize(24);
  doc.setTextColor('1d87e4')
  doc.text('Star Wars: Unlimited™ Deck Form', 105, 20, { align: 'center' });
  
  // Header section
  doc.setFontSize(11);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor('000000')
  doc.rect(10, 35, 190, 8); 
  doc.text('Name', 15, 40);
  doc.rect(10, 43, 190, 8); 
  doc.text('Pronouns', 15, 48);
  doc.rect(10, 51, 190, 8); 
  doc.text('Leader', 15, 56);

  doc.text('FFG ID', 125, 40);
  doc.text('Date', 125, 48);
  doc.text('Base', 125, 56);

  doc.rect(10, 35, 28, 24)
  doc.rect(120, 35, 22, 24)
  doc.setLineWidth(0.5);
  doc.line(120, 35, 120, 59)

  doc.setFont('helvetica', 'normal');

  doc.setLineWidth(0.1);
  doc.text('Last Initial', 158, 32)
  doc.rect(180, 27, 20, 8)
  
  // Main deck sections
  let y = 80;

  doc.setFontSize(10);
  doc.text(`${deck.leader.title}, ${deck?.leader?.subtitle}`, 40, 56);
  doc.text(`${deck.base.title}`, 145, 56);
  
  const units = deck.cards.filter(card => card.type === 'Unit')
  const events = deck.cards.filter(card => card.type === 'Event')
  const upgrades = deck.cards.filter(card => card.type === 'Upgrade')
  
  // Units Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('UNITS', 10, y);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  const unitCount = units.reduce((acc, card) => acc + card.count, 0);
  doc.text(`Count: ${unitCount}`, 10, y + 4);
  doc.setFont('helvetica', 'normal');

  y+= 10;
  doc.setFontSize(11);
  units.forEach(card => {
    doc.text(`${card.count}x ${card.title} [${card.expansion[0].code}]`, 10, y);
    y += 6;
  });
  
  // Events Section
  y = 80;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('EVENTS', 100, y);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  const eventCount = events.reduce((acc, card) => acc + card.count, 0);
  doc.text(`Count: ${eventCount}`, 100, y + 4);
  doc.setFont('helvetica', 'normal');

  y+= 10;
  doc.setFontSize(11);
  events.forEach(card => {
    doc.text(`${card.count}x ${card.title} [${card.expansion[0].code}]`, 100, y);
    y += 6;
  });

  // Upgrades Section
  y += 5;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('UPGRADES', 100, y);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  const upgradeCount = upgrades.reduce((acc, card) => acc + card.count, 0);
  doc.text(`Count: ${upgradeCount}`, 100, y + 4);
  doc.setFont('helvetica', 'normal');

  y+= 10;
  doc.setFontSize(11);
  upgrades.forEach(card => {
    doc.text(`${card.count}x ${card.title} [${card.expansion[0].code}]`, 100, y);
    y += 6;
  });
  
  // Sideboard Section
  if (deck.sideboard && deck.sideboard.length > 0) {
    y += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('SIDEBOARD', 100, y);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    const sideboardCount = deck.sideboard.reduce((acc, card) => acc + card.count, 0);
    doc.text(`Count: ${sideboardCount}`, 100, y + 4);
    doc.setFont('helvetica', 'normal');
    
    y += 10;
    doc.setFontSize(11);
    deck.sideboard.forEach(card => {
      doc.text(`${card.count}x ${card.title} [${card.expansion[0].code}]`, 100, y);
      y += 6;
    });
  }
  
  // Footer
  const footerY = 280;
  doc.setFontSize(8);
  doc.text('This form is an unofficial fan document. Star Wars: Unlimited is a trademark of Fantasy Flight Games.', 105, footerY, { align: 'center' });
  doc.text('Player is solely responsible for the accuracy of this form.', 105, footerY + 4, { align: 'center' });
  
  // Save the PDF
  doc.save(`${deck.name}_deck_form.pdf`);
};
