import '../App.css';
import '../index.css';

interface CardProps {
  title: string;
  eamount: number;
  iamount: number;
  bamount: number;
}

function Cards(props: CardProps) {
  const getValue = () => {
    if (props.title.includes("Balance")) return props.bamount;
    if (props.title.includes("Income")) return props.iamount;
    return props.eamount;
  };

  const getAccentColor = () => {
    if (props.title.includes("Balance")) return 'var(--primary)';
    if (props.title.includes("Income")) return 'var(--success)';
    return 'var(--error)';
  };

  const value = getValue();

  return (
    <div className="glass-card" style={{ 
      padding: '1.5rem', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '0.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Accent Ornament */}
      <div style={{
        position: 'absolute',
        top: '-10px',
        right: '-10px',
        width: '60px',
        height: '60px',
        background: getAccentColor(),
        opacity: 0.1,
        borderRadius: '50%'
      }}></div>

      <span style={{ 
        color: 'var(--text-muted)', 
        fontSize: '0.875rem', 
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {props.title}
      </span>
      
      <div style={{ 
        fontSize: '2rem', 
        fontWeight: '800', 
        color: getAccentColor() 
      }}>
        ${value.toLocaleString()}
      </div>
    </div>
  );
}

export default Cards;