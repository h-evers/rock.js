<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8">
	<meta name="viewport" content="width=320" />
    <title>Rock.js | Rockdown</title>
    <link rel="stylesheet" href="css/rock.css" type="text/css">
    <link rel="stylesheet" href="css/rocktheme/style.css" type="text/css">
    <link rel="stylesheet" href="css/comparaison/ufd/ufd-base.css" type="text/css">
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
	</style>
</head>
<body>
<?php define('LOOPS',21);?>

<?php
$html = '';
for($i=1;$i<=LOOPS;$i++){

if($i%10===1){
    $html .= '<optgroup label="'.$i.'">'."\n";
    }
              $html .= '<option value="value'.$i.'">option '.$i.'</option>'."\n";
if($i%10===0 || $i==LOOPS){
        $html .= '</optgroup>'."\n";
    }
}

?>

	<table>
        <thead>
        <tr>
            <th><?php echo LOOPS;?> Rock.js</th><th><?php echo LOOPS;?> ufd</th><th><?php echo LOOPS;?> rock fast</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>
                <label for="rock">click</label>
                <select id="rock" name="rock">
                <?php echo $html;?>
            </select>
            </td>

            <td>
                <label for="ufd">click</label>
                <select id="ufd" name="rock">
              <?php echo $html;?>
            </select></td>

            <td>
                <label for="rock_fast">click</label>
                <select id="rock_fast" name="rock">
                        <?php echo $html;?>
            </select>
            </td>

        </tr>
        <tr>
            <td id="rock_result">0</td><td id="ufd_result">0</td><td id="rock_fast_result">0</td>
        </tr>
        </tbody>

	</table>

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
    <script type="text/javascript" src="js/jquery.rock.js"></script>
    <script type="text/javascript" src="js/jquery.rock_fast.js"></script>
    <script type="text/javascript" src="js/comparaison/uid/jquery-ui-1.8.js"></script>
    <script type="text/javascript" src="js/comparaison/uid/ui.core.js"></script>
    <script type="text/javascript" src="js/comparaison/uid/jquery.ui.ufd.min.js"></script>
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





		});
    </script>
</body>
</html>