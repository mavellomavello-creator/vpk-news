import { ReactNode, useId, useRef, useEffect } from 'react';
import '../styles/components/_tooltip.scss';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom';
  className?: string;
}

// Компонент підказки (Tooltip) з використанням Popover API та CSS Anchor Positioning
export function Tooltip({ content, children, position = 'top', className = '' }: TooltipProps) {
  const generatedId = useId();
  const safeId = generatedId.replace(/:/g, '');
  const tooltipId = `tooltip-${safeId}`;
  const anchorName = `--anchor-${safeId}`;
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  // Підтримка активації popover при наведенні або фокусі для браузерів без native interestfor
  useEffect(() => {
    const trigger = triggerRef.current;
    const popover = popoverRef.current;
    if (!trigger || !popover) return;

    const show = () => {
      try {
        if (!popover.matches(':popover-open')) {
          popover.showPopover();
        }
      } catch {}
    };

    const hide = () => {
      try {
        if (popover.matches(':popover-open')) {
          popover.hidePopover();
        }
      } catch {}
    };

    trigger.addEventListener('mouseenter', show);
    trigger.addEventListener('mouseleave', hide);
    trigger.addEventListener('focusin', show);
    trigger.addEventListener('focusout', hide);

    return () => {
      trigger.removeEventListener('mouseenter', show);
      trigger.removeEventListener('mouseleave', hide);
      trigger.removeEventListener('focusin', show);
      trigger.removeEventListener('focusout', hide);
    };
  }, []);

  return (
    <span
      ref={triggerRef}
      className={`tooltip-anchor ${className}`}
      style={{ anchorName } as React.CSSProperties}
      aria-describedby={tooltipId}
      {...({ interestfor: tooltipId } as any)}
    >
      {children}
      <div
        ref={popoverRef}
        id={tooltipId}
        role="tooltip"
        {...({ popover: 'hint' } as any)}
        className={`modern-tooltip modern-tooltip--${position}`}
        style={{ positionAnchor: anchorName } as React.CSSProperties}
      >
        {content}
      </div>
    </span>
  );
}

export default Tooltip;
