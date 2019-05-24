$day = date('d');

if ($day > 15) {
	$dia = 18;
} else {

	$dia = 10;
}

$mes            = date('n');
$year           = date('Y');
$contadorCambio = 0;
$auxCambio      = 0;// si es 0 el mes no es junio

$meses  = array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
$nMeses = array('01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12');
$text   = '';
for ($contador = 0; $contador <= 11; $contador++) {

	if ($mes == 6 && $year == 2017 && $contadorCambio == 1) {
		$auxCambio = 1;
	} else if ($mes < 6 && $year <= 2017) {
		$auxCambio = 1;
	}

	if ($year <= 2017) {
		if ($dia == 18) {
			$text = "Segunda quincena de ".$meses[$mes-1];
			$dMax = cal_days_in_month(CAL_GREGORIAN, $nMeses[$mes-1], $year);
			$dMin = 16;

		} else {
			$text = "Primera quincena de ".$meses[$mes-1];
			$dMax = 15;
			$dMin = "01";
		}

		$fechaIN   = $dMin.'/'.$nMeses[$mes-1].'/'.$year;
		$fechaFIN  = $dMax.'/'.$nMeses[$mes-1].'/'.$year;
		$diaUltimo = 0;
	}

	#fecha de nuevo pago que sera: el día 20 será el pago y 6 días hábiles el corte

	if ($year >= 2017 && $auxCambio == 0) {

		#checar el cambio de año resulta un error

		$diaNuevo    = 20;
		$obtenerDias = array('Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado');

		#-----------------------------------------------------------------------------
		# Se obtiene el dia del corte del mes siguiente
		if ($contador == 0) {

			$yearSiguiente = $year;

			if ($mes == 12) {
				$mesSiguiente  = 1;
				$yearSiguiente = $year+1;
			} else {
				$mesSiguiente = $mes+1;
			}

			$fechaNuevoCorte = $diaNuevo.'-'.$mesSiguiente.'-'.$yearSiguiente;

			$fechats = strtotime($fechaNuevoCorte);

			if ($obtenerDias[date('w', $fechats)] == 'Sabado') {
				$diaNuevo += 2;
			} else if ($obtenerDias[date('w', $fechats)] == 'Domingo') {
				$diaNuevo++;
			}

			$fechaNuevoTemporal = $fechaNuevoCorte;
			$diaCorteTemporal   = $diaNuevo;
			$i                  = 0;
			$fechats            = strtotime($fechaNuevoTemporal);
			$diasCantidad       = 5;
			if ($obtenerDias[date('w', $fechats)] == 'Viernes') {
				$diasCantidad = 6;
			}
			while ($i < $diasCantidad) {

				$fechats = strtotime($fechaNuevoTemporal);

				if ($obtenerDias[date('w', $fechats)] != 'Sabado' && $obtenerDias[date('w', $fechats)] != 'Domingo') {
					$i++;
				}
				if ($diasCantidad == 6 && $i < $diasCantidad) {
					$diaCorteTemporal--;
				} else if ($diasCantidad == 5) {
					$diaCorteTemporal--;
				}

				#$diaCorteTemporal--;
				$fechaNuevoTemporal = $diaCorteTemporal.'-'.$mesSiguiente.'-'.$yearSiguiente;

			}
			$diaSiguienteCorte = $diaCorteTemporal;
			$diaFinal[$mes]    = $diaCorteTemporal;
			#$fechaFinal[$mesSiguiente] = $diaCorteTemporal.'/'.$nMeses[$mesSiguiente].'/'.$yearSiguiente;
			#echo " sig".$mesSiguiente."diaSiguienteCorte ".$diaSiguienteCorte;
		}


		#-----------------------------------------------------------------------------
		var_dump($mes, $year);
		if($mes == 1 && $year == '2019')
			$diaNuevo = 22;
		else
			$diaNuevo = 20;

		$fechaNuevoCorte = $diaNuevo.'-'.$mes.'-'.$year;

		$fechats = strtotime($fechaNuevoCorte);

		if ($obtenerDias[date('w', $fechats)] == 'Sabado') {
			$diaNuevo += 2;
		} else if ($obtenerDias[date('w', $fechats)] == 'Domingo') {
			$diaNuevo += 1;
		}

		$fechaNuevoCorte = $diaNuevo.'-'.$mes.'-'.$year;

		$fechaNuevoTemporal = $fechaNuevoCorte;
		$diaCorteTemporal   = $diaNuevo;
		$i                  = 0;

		$fechats      = strtotime($fechaNuevoTemporal);
		$diasCantidad = 5;
		if ($obtenerDias[date('w', $fechats)] == 'Viernes') {
			$diasCantidad = 6;
		}

		while ($i < $diasCantidad) {

			$fechats = strtotime($fechaNuevoTemporal);

			if ($obtenerDias[date('w', $fechats)] != 'Sabado' && $obtenerDias[date('w', $fechats)] != 'Domingo') {
				$i++;
			}

			if ($diasCantidad == 6 && $i < $diasCantidad) {
				$diaCorteTemporal--;
			} else if ($diasCantidad == 5) {
				$diaCorteTemporal--;
			}

			$fechaNuevoTemporal = $diaCorteTemporal.'-'.$mes.'-'.$year;

		}

		if ($mes == 0) {
			$fechaTemporal[0] = ($diaCorteTemporal+1).'/'.$nMeses[11].'/'.($year-1);

		} else {
			$fechaTemporal[0] = ($diaCorteTemporal+1).'/'.$nMeses[$mes-1].'/'.$year;
		}

		$diaFinal[$mes] = $diaCorteTemporal;

		if ($contador == 0) {

			if ($mes == 12) {
				#$fechaFinal[$mes] = $diaCorteTemporal.'/'.$nMeses[$mes-1].'/'.($year+1);
				$fechaFinal[$mes] = $diaFinal[1].'/'.$nMeses[$mes-1].'/'.($year+1);
			} else if ($mes == 11) {
				$fechaFinal[$mes] = $diaFinal[$mes].'/'.$nMeses[$mes].'/'.$year;
			} else {
				$fechaFinal[$mes] = $diaSiguienteCorte.'/'.$nMeses[$mes].'/'.$year;
				#$fechaFinal[$mes] = $diaCorteTemporal.'/'.$nMeses[$mes].'/'.$year;
			}
			$diaUltimo = $diaSiguienteCorte;
			/*echo "entre en con";
		echo $fechaFinal[$mes];*/
		} else {
			if ($mes == 12) {
				$fechaFinal[$mes] = $diaFinal[1].'/'.$nMeses[$mes].'/'.$year;
				$diaUltimo        = $diaFinal[1];
			} else if ($mes == 11) {
				$fechaFinal[$mes] = $diaFinal[$mes].'/'.$nMeses[$mes].'/'.$year;
				$diaUltimo        = $diaFinal[$mes];
			} else {
				$fechaFinal[$mes] = $diaFinal[$mes+1].'/'.$nMeses[$mes].'/'.$year;
				$diaUltimo        = $diaFinal[$mes+1];
			}
			#echo " Diaultimo ".$diaUltimo;
		}

		#echo ' fecha inicial(fechaTemporal) '.$fechaTemporal[0].'  fecha final(fechaFinal) '.$fechaFinal[$mes];

		$dia = $diaCorteTemporal;

		if ($text != 'Primera quincena de Junio') {
			if ($mes == 0) {// checar
				$text = "Mes de ".$meses[11]." a ".$meses[$mes];
			} else {
				if ($mes == 12) {
					$text = "Mes de ".$meses[$mes-1]." a ".$meses[0];
				} else {
					$text = "Mes de ".$meses[$mes-1]." a ".$meses[$mes];
				}

			}

			$fechaIN = $fechaTemporal[0];
			if ($contador == 0) {//checar
				$fechaFIN = $fechaFinal[$mes];
			} else {
				$fechaFIN = $fechaFinal[$mes];
			}

			//$fechaFIN = $fechaTemporal[1];

		} else if ($contadorCambio == 0 && $text == 'Primera quincena de Junio') {
			$text     = "Mes de ".$meses[$mes-1]." a ".$meses[$mes];
			$fechaIN  = $fechaTemporal[0];
			$fechaFIN = $fechaFinal[$mes];
			//$fechaFIN = $fechaTemporal[1];
		}
		if ($mes == 6 && $year == 2017) {
			$contadorCambio = 1;
		}
	}

	$mesEnvio = 0;
	if ($mes == 0) {
		$mesEnvio = 0;
	} else {
		$mesEnvio = $mes-1;
	}