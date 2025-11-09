import { ref, computed } from 'vue';

/**
 * Composable para manejar estadísticas
 */
export function useStatistics() {
  const selectedTime = ref('september');
  const isAnimating = ref(false);

  // Datos de septiembre
  const septemberData = {
    sales: {
      total: 1425000,
      series: [{
        name: 'Ventas Diarias',
        data: [
          42500, 43800, 41200, 44800, 46200, 48500, 52500, 44200, 45200, 46800,
          47500, 49200, 51500, 53500, 55200, 48200, 49800, 51200, 52800, 54500,
          56200, 58200, 49800, 50800, 51800, 53200, 54800, 56300, 57800, 59200
        ]
      }]
    },
    products: {
      total: 1245,
      series: [{
        name: 'Productos Vendidos',
        data: [
          38, 42, 36, 44, 48, 52, 58, 41, 43, 46,
          47, 49, 51, 54, 55, 48, 50, 52, 54, 56,
          58, 60, 50, 52, 53, 54, 55, 57, 58, 59
        ]
      }]
    },
    clients: {
      total: 342,
      series: [{
        name: 'Nuevos Clientes',
        data: [
          10, 12, 9, 14, 15, 16, 18, 11, 12, 13,
          14, 15, 16, 17, 18, 14, 15, 16, 17, 18,
          19, 20, 15, 16, 17, 18, 19, 20, 21, 22
        ]
      }]
    },
    categories: {
      series: [485000, 420000, 285000, 235000],
      labels: ['Laptops', 'Smartphones', 'Tablets', 'Accesorios']
    }
  };

  // Datos de octubre
  const octoberData = {
    sales: {
      total: 1580000,
      series: [{
        name: 'Ventas Diarias',
        data: [
          46200, 47800, 49200, 51200, 53200, 55200, 57200, 48200, 49800, 51200,
          52800, 54200, 56200, 58200, 60200, 52200, 53800, 55200, 56800, 58200,
          60200, 62200, 54200, 55800, 57200, 58800, 60200, 61800, 63200, 64800, 66200
        ]
      }]
    },
    products: {
      total: 1380,
      series: [{
        name: 'Productos Vendidos',
        data: [
          42, 44, 46, 48, 50, 52, 54, 46, 48, 50,
          52, 54, 56, 58, 60, 52, 54, 56, 58, 60,
          62, 64, 56, 58, 60, 62, 64, 66, 68, 70, 72
        ]
      }]
    },
    clients: {
      total: 385,
      series: [{
        name: 'Nuevos Clientes',
        data: [
          12, 13, 14, 15, 16, 17, 18, 14, 15, 16,
          17, 18, 19, 20, 21, 17, 18, 19, 20, 21,
          22, 23, 19, 20, 21, 22, 23, 24, 25, 26, 27
        ]
      }]
    },
    categories: {
      series: [540000, 470000, 320000, 250000],
      labels: ['Laptops', 'Smartphones', 'Tablets', 'Accesorios']
    }
  };

  const currentData = computed(() => {
    return selectedTime.value === 'september' ? septemberData : octoberData;
  });

  const monthLabels = computed(() => {
    const days = selectedTime.value === 'september' ? 30 : 31;
    return Array.from({ length: days }, (_, i) => (i + 1).toString());
  });

  const onTimeChange = () => {
    isAnimating.value = true;
    setTimeout(() => {
      isAnimating.value = false;
    }, 400);
  };

  return {
    selectedTime,
    isAnimating,
    currentData,
    monthLabels,
    onTimeChange
  };
}

