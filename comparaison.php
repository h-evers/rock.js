<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8">
	<meta name="viewport" content="width=320" />
    <title>Rock.js | Rockdown</title>
    <link rel="stylesheet" href="css/rock.css" type="text/css">
    <link rel="stylesheet" href="css/rocktheme/style.css" type="text/css">
    <link rel="stylesheet" href="css/comparaison/ufd/ufd-base.css" type="text/css">
    <link rel="stylesheet" href="css/comparaison/uniform/uniform.default.css" type="text/css">
    <style type="text/css">
		body {
			background: #f4f3ef;
			margin: 50px 0 0 50px;
			font-family: "Trebuchet MS", Helvetica, Verdana, sans-serif;
			font-size: 14px;
		}
		ul.rockdown, select {
			margin: 20px;
		}
        table,td,th {
            border:1px solid #ccc;
            border-collapse:collapse;
            padding:3px;
        }
        td {
            text-align:right;
        }
	</style>
</head>
<body>
<?php define('LOOPS',500);?>

<?php

function random_string(){
    $str = '';
    for ($i=0; $i<6; $i++) {
        $d=rand(1,30)%2;
        $str .= $d ? chr(rand(65,90)) : chr(rand(48,57));
    }
    return $str;
}

$html = '';
for($i=1;$i<=LOOPS;$i++){

if($i%10===1){
    $html .= '<optgroup label="'.random_string().'">'."\n";
    }
              $html .= '<option value="value'.random_string().'">'.random_string().'</option>'."\n";
if($i%10===0 || $i==LOOPS){
        $html .= '</optgroup>'."\n";
    }
}

?>

	<table>
        <thead>
        <tr>
            <th><?php echo LOOPS;?> Rock.js</th><th><?php echo LOOPS;?> ufd</th><th><?php echo LOOPS;?> uniform</th><th><?php echo LOOPS;?> rock fast</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>
                <label for="rock">label</label>
                <select id="rock" name="rock">
                <?php echo $html;?>
            </select>
            </td>

            <td>
                <label for="ufd">label</label>
                <select id="ufd" name="rock">
              <?php echo $html;?>
            </select></td>

            <td>
                <label for="uniform">label</label>
                <select id="uniform" name="uniform">
              <?php echo $html;?>
            </select></td>

            <td>
                <label for="rock_fast">label</label>
                <select id="rock_fast" name="rock">
                        <?php echo $html;?>
            </select>
            </td>

        </tr>
        <tr>
            <td id="rock_result">0</td><td id="ufd_result">0</td><td id="uniform_result">0</td><td id="rock_fast_result">0</td>
        </tr>
        </tbody>

	</table>

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
    <script type="text/javascript" src="js/jquery.rock.js"></script>
    <script type="text/javascript" src="js/jquery.rock_fast.js"></script>
    <script type="text/javascript" src="js/comparaison/uid/jquery-ui-1.8.js"></script>
    <script type="text/javascript" src="js/comparaison/uid/ui.core.js"></script>
    <script type="text/javascript" src="js/comparaison/uid/jquery.ui.ufd.min.js"></script>
    <script type="text/javascript" src="js/comparaison/uniform/jquery.uniform.min.js"></script>
    <script type="text/javascript">
        $(document).ready(function ($) {
            var start = (new Date).getTime();
            $('#ufd').ufd();
            var diff = (new Date).getTime() - start;
            $('#ufd_result').text(diff+' ms');


            var start = (new Date).getTime();
            $('#rock').rocks();
            var diff = (new Date).getTime() - start;
            $('#rock_result').text(diff+' ms');

            var start = (new Date).getTime();
            $('#rock_fast').rock_fast();
            var diff = (new Date).getTime() - start;
            $('#rock_fast_result').text(diff+' ms');

            var start = (new Date).getTime();
            $('#uniform').uniform();
            var diff = (new Date).getTime() - start;
            $('#uniform_result').text(diff+' ms');





		});
    </script>
</body>
</html>