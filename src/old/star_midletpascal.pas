program Hello;

  type
  // Описываем тип-элемент Звезда
    TStar = record
      X, Y, Z : Integer; // Положение в пространстве
    end;

  const
    MAX_STARS = 150;        // Кол-во звёздочек
    HELLO = 'HELLO WORLD!'; // "Та самая надпись" :)
    SPEED = 200;            // Скорость, в единицах/сек

  var
    i     : Integer;
  // Наши звёздочки :)  
    Stars : array [1..MAX_STARS] of TStar;
  // Ширина и высота дисплея
    scr_W : Integer;
    scr_H : Integer;
  // Время
    time, dt : Integer;

  // Рисует текущую звёздочку (i), цвета ©
    procedure SetPix(c: Integer);
    var
      sx, sy : Integer;
    begin
    // Данные действия, проецируют 3D точку на 2D полоскость дисплея
      sx := trunc(scr_W / 2 + Stars[i].X * 200 / (Stars[i].Z + 200));
      sy := trunc(scr_H / 2 - Stars[i].Y * 200 / (Stars[i].Z + 200));
      SetColor(c, c, c); // Устанавливаем цвет
      Plot(sx, sy);      // Выводим пиксель этого цвета
    end;

  begin
  // Для начала, получим размеры экрана
    scr_W := GetWidth;  
    scr_H := GetHeight;
  // Затем, случайным образом раскидаем звёздочки
    randomize;
    for i := 1 to MAX_STARS do
    begin
      Stars[i].X := random(scr_W * 4) - scr_W * 2;
      Stars[i].Y := random(scr_H * 4) - scr_H * 2;
      Stars[i].Z := random(1900);
    end;
    
  // Очистка содержимого дисплея (чёрный цвет)  
    SetColor(0, 0, 0);
    FillRect(0, 0, scr_W, scr_H);  
    
    time := GetRelativeTimeMs;
  // Главный цикл отрисовки
    repeat
      dt   := GetRelativeTimeMs - time;  // Сколько мс прошло, с прошлой отрисовки
      time := GetRelativeTimeMs;         // Засекаем время
      for i := 1 to MAX_STARS do
        begin
      // Затираем звёздочку с предыдущего кадра
        SetPix(0);
      // Изменяем её позицию в зависимости прошедшего с последней отрисовки времени
        Stars[i].Z := Stars[i].Z - SPEED * dt/1000;
      // Если звезда "улетела" за позицию камеры - генерируем её вдали
        if Stars[i].Z <= -200 then
        begin
          Stars[i].X := random(scr_W * 4) - scr_W * 2;
          Stars[i].Y := random(scr_H * 4) - scr_H * 2;
          Stars[i].Z := 1900; // Откидываем звезду далеко вперёд :)
        end;
      // Рисуем звёздочку в новом положении (цвет зависит от Z координаты) 
        SetPix(trunc(255 - 255 * (Stars[i].Z + 200) / 2100));
      end;
    // Выводим текст по центру экрана
      SetColor(255, 0, 0);
      DrawText(HELLO, (scr_W - GetStringWidth(HELLO))/2, 0); 
    // Всё что было нами нарисовано - выводим на дисплей
      repaint;
    until GetKeyClicked = KE_KEY0; // Закрыть приложение при нажатии "0"
  end.