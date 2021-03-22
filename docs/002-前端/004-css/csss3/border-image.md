### 盒边框背景

border-image:
复合属性，是border新加的一个属性
border-image-source；url()；
引入图片
border-image-slice:10 10 10 10 ;
切割的图片尺寸(这里没有单位px) 该属性指定从上，右，下，左方位来分隔图像， 将图像分成4个角，4条边和中间区域共9份， 中间区域始终是透明的（即没图像填充）， 除非加上关键字 fill。
border-image-width:
边框宽度
border-image-repeat:
边框是平铺，round平铺、repeat重复、stretch（默认）拉伸
例子：
border:20px solid red;//必须写，如果下面的语句失效，此时边框填充颜色
border-image:url(Hydrangeas.jpg) 20 20 20 20 repeat;

因为border-image是border的一个属性，所以先有border再有border-image 这就是border必须写的原因