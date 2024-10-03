// plugins/tooltip.js
import { tooltipState } from '~/components/base/messaging/tooltipState.js';

export default defineNuxtPlugin(() => {
    return {
        provide: {
            tooltipDirective: {
                mounted(el, binding) {
                    let timeout;
                    el.addEventListener('mouseenter', (event) => {
                        timeout = setTimeout(() => {
                            const tooltipRect = el.getBoundingClientRect();
                            tooltipState.content = binding.value;
                            tooltipState.position.top = tooltipRect.top - tooltipRect.height;
                            tooltipState.position.left = tooltipRect.left;
                            tooltipState.visible = true;
                        }, 600);
                    });

                    el.addEventListener('mouseleave', () => {
                        clearTimeout(timeout);
                        tooltipState.visible = false;
                    });
                }
            }
        }
    };
});
