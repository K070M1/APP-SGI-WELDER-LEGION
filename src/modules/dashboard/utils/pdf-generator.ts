import { Alert, Linking } from 'react-native';
import { dashboardService } from '@/api/dashboard/dashboard.service';
import { insforge } from '@/lib/insforge';

export const generateDashboardPDF = async () => {
  try {
    Alert.alert('Generando...', 'Recopilando datos y creando tu PDF, por favor espera.');

    // 1. Recopilar datos
    const [kpis, topProducts, movementsFlow, activeUsers, rolesChart] = await Promise.all([
      dashboardService.getKPIs(),
      dashboardService.getProductsChart(),
      dashboardService.getMovementsChart(),
      dashboardService.getActiveUsersChart(),
      dashboardService.getUsersChart(),
    ]);

    // Obtener últimos 10 movimientos para la tabla
    const { data: recentMovements } = await insforge.database
      .from('movimiento')
      .select(`
        id,
        tipo,
        motivo,
        fechaRegistro,
        created_at,
        usuario (nombreUsuario)
      `)
      .order('fechaRegistro', { ascending: false })
      .limit(10);

    // Obtener la lista completa de usuarios y sus roles
    const { data: allUsers } = await insforge.database
      .from('usuario')
      .select('nombreUsuario, correo, rol, estado')
      .order('rol', { ascending: true });

    // 2. Construir HTML
    const today = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Convertir datos a JSON para Chart.js
    const rolesLabels = rolesChart.map(r => r.label);
    const rolesData = rolesChart.map(r => r.value);

    let htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte de Dashboard</title>
        <!-- Importar Chart.js -->
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1E293B; margin: 0; padding: 40px; }
          .header { text-align: center; border-bottom: 2px solid #3B82F6; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #1E293B; margin: 0; font-size: 28px; }
          .header p { color: #64748B; margin: 5px 0 0 0; }
          
          .kpi-container { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .kpi-card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; width: 22%; text-align: center; }
          .kpi-card h3 { font-size: 14px; color: #64748B; margin: 0 0 10px 0; }
          .kpi-card p { font-size: 24px; font-weight: bold; color: #3B82F6; margin: 0; }
          .kpi-card.alert p { color: #EF4444; }

          .section-title { font-size: 18px; color: #1E293B; border-bottom: 1px solid #E2E8F0; padding-bottom: 10px; margin-top: 40px; margin-bottom: 20px; }
          
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
          th { background-color: #F1F5F9; color: #334155; font-weight: bold; padding: 12px; text-align: left; border-bottom: 2px solid #CBD5E1; }
          td { padding: 12px; border-bottom: 1px solid #E2E8F0; color: #475569; }
          tr:nth-child(even) { background-color: #F8FAFC; }
          
          .badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
          .badge.entrada { background-color: #DCFCE7; color: #166534; }
          .badge.salida { background-color: #FEE2E2; color: #991B1B; }
          
          .page-break { page-break-before: always; margin-top: 40px; }
          .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #94A3B8; }
          .chart-container { width: 48%; height: 250px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Reporte Estadístico SGI</h1>
          <p>Generado el ${today}</p>
        </div>

        <div class="kpi-container">
          <div class="kpi-card">
            <h3>Total Productos</h3>
            <p>${kpis.totalProducts}</p>
          </div>
          <div class="kpi-card alert">
            <h3>Stock Crítico</h3>
            <p>${kpis.lowStockProducts}</p>
          </div>
          <div class="kpi-card">
            <h3>Movs. Hoy</h3>
            <p>${kpis.movementsToday}</p>
          </div>
          <div class="kpi-card">
            <h3>Usuarios Act.</h3>
            <p>${kpis.activeUsers}</p>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
          <div class="chart-container">
            <canvas id="rolesChart"></canvas>
          </div>
          <div style="width: 48%;">
            <h2 class="section-title" style="margin-top: 0;">Usuarios más activos</h2>
            <table>
              <thead><tr><th>Usuario</th><th>Registros</th></tr></thead>
              <tbody>
                ${activeUsers.map(u => `<tr><td>${u.label}</td><td>${u.value}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <h2 class="section-title">Últimos Movimientos Registrados</h2>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Motivo</th>
              <th>Usuario</th>
            </tr>
          </thead>
          <tbody>
            ${(recentMovements || []).map(m => {
              // Fix date fallback: if fechaRegistro is missing/invalid, use created_at
              const dateVal = m.fechaRegistro || m.created_at;
              let dateStr = 'Sin fecha';
              if (dateVal) {
                const dateObj = new Date(dateVal);
                if (!isNaN(dateObj.getTime())) {
                  dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                }
              }
              
              const userObj = Array.isArray(m.usuario) ? m.usuario[0] : m.usuario;
              const userName = userObj?.nombreUsuario || 'Desconocido';
              
              return '<tr>' +
                '<td>' + dateStr + '</td>' +
                '<td><span class="badge ' + m.tipo.toLowerCase() + '">' + m.tipo + '</span></td>' +
                '<td>' + m.motivo + '</td>' +
                '<td>' + userName + '</td>' +
              '</tr>';
            }).join('')}
          </tbody>
        </table>

        <div class="page-break"></div>
        <div class="header">
          <h1>Directorio de Usuarios del Sistema</h1>
          <p>Listado completo de personal y roles</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nombre de Usuario</th>
              <th>Correo Electrónico</th>
              <th>Rol Asignado</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${(allUsers || []).map(u => {
              const rolStr = u.rol ? u.rol.toUpperCase() : 'SIN ROL';
              const estadoBadge = u.estado === 'inactivo' 
                ? '<span style="color: #EF4444; font-weight: bold;">Inactivo</span>' 
                : '<span style="color: #10B981; font-weight: bold;">Activo</span>';
              
              return '<tr>' +
                '<td>' + (u.nombreUsuario || '-') + '</td>' +
                '<td>' + (u.correo || '-') + '</td>' +
                '<td><span class="badge" style="background: #E2E8F0; color: #334155;">' + rolStr + '</span></td>' +
                '<td>' + estadoBadge + '</td>' +
              '</tr>';
            }).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Sistema de Gestión de Inventarios SGI - Reporte Automático</p>
        </div>

        <script>
          // Render Chart
          const ctx = document.getElementById('rolesChart').getContext('2d');
          new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: ${JSON.stringify(rolesLabels)},
              datasets: [{
                data: ${JSON.stringify(rolesData)},
                backgroundColor: ['#3B82F6', '#1E293B', '#64748B', '#94A3B8'],
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: { display: true, text: 'Distribución de Roles', font: { size: 16 } },
                legend: { position: 'bottom' }
              }
            }
          });
        </script>
      </body>
      </html>
    `;

    // 3. Consumir el API de Api2Pdf
    const API_KEY = '1152c252-d72c-440b-8ce0-3d5ca6d9e948'; 

    const response = await fetch('https://v2.api2pdf.com/chrome/pdf/html', {
      method: 'POST',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: htmlContent,
        inline: false,
        fileName: `reporte-dashboard-${Date.now()}.pdf`,
        options: {
          delay: 1000 // Esperar 1 segundo para que Chart.js se dibuje
        }
      })
    });

    const result = await response.json();

    if (result.FileUrl) {
      await Linking.openURL(result.FileUrl);
    } else {
      throw new Error('El API no devolvió un link válido');
    }

  } catch (error: any) {
    console.error('Error generating Dashboard PDF:', error);
    Alert.alert('Error', error?.message || 'Hubo un problema al generar el reporte.');
  }
};
